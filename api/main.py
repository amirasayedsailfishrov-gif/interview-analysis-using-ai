import os
import uuid
import asyncio
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from utils import extract_audio
from analysis import analyze_all
from groq import Groq
from memory_store import video_results

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:3001", 
        "http://127.0.0.1:3001", 
        "http://localhost:3002", 
        "http://127.0.0.1:3002",
        "https://*.vercel.app",  # Allow all Vercel domains
        "https://*.hf.space",    # Allow Hugging Face Spaces
        "*"  # Allow all origins for production (you can restrict this later)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Get API key from environment variable (more secure)
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your-groq-api-key-here")

# Test if Groq client can be initialized
try:
    client = Groq(api_key=GROQ_API_KEY)
    print("✅ Groq client initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize Groq client: {e}")
    client = None


@app.get("/")
async def root():
    return {"message": "AI Interview Analyzer API is running", "groq_available": client is not None}


@app.get("/test")
async def test_endpoint():
    """Test endpoint to check if the API is working"""
    groq_status = "available"
    if client is None:
        groq_status = "unavailable"
    else:
        # Test if we can actually use the Groq client
        try:
            # This is a simple test that doesn't use credits
            models = client.models.list()
            # Check if whisper-large-v3 is available
            model_names = [m.id for m in models.data]
            if "whisper-large-v3" in model_names:
                groq_status = "working - whisper available"
            else:
                groq_status = "working - whisper not found"
        except Exception as e:
            groq_status = f"error: {str(e)}"
    
    return {
        "status": "ok", 
        "message": "API is working correctly",
        "groq_client": groq_status
    }


@app.post("/video")
async def upload_video(video: UploadFile = File(...)):
    try:
        print(f"📹 Received video upload: {video.filename}, size: {video.size}")
        
        # Check if Groq client is available
        if client is None:
            raise HTTPException(status_code=500, detail="Groq API client is not available")
        
        filename = f"{uuid.uuid4().hex}_{video.filename}"
        video_path = os.path.join(UPLOAD_FOLDER, filename)

        print(f"💾 Saving video to: {video_path}")
        with open(video_path, "wb") as f:
            content = await video.read()
            f.write(content)
            print(f"✅ Video saved successfully, size: {len(content)} bytes")

        print("🎵 Extracting audio from video...")
        try:
            audio_path = extract_audio(video_path)
            print(f"✅ Audio extracted to: {audio_path}")
        except Exception as e:
            print(f"❌ Audio extraction failed: {e}")
            raise HTTPException(status_code=500, detail=f"Audio extraction failed: {str(e)}")

        print("🗣️ Starting transcription with Groq...")
        try:
            # Check audio file size
            audio_size = os.path.getsize(audio_path)
            print(f"📊 Audio file size: {audio_size / (1024*1024):.2f} MB")
            
            # Groq has a 25MB limit for audio files
            if audio_size > 25 * 1024 * 1024:
                raise HTTPException(status_code=413, detail="Audio file too large (max 25MB)")
            
            with open(audio_path, "rb") as file:
                audio_data = file.read()
                print(f"📤 Sending {len(audio_data)} bytes to Groq API...")
                
                # Create a new Groq client with timeout settings
                import httpx
                timeout_client = Groq(
                    api_key=GROQ_API_KEY,
                    http_client=httpx.Client(timeout=300.0)  # 5 minutes timeout
                )
                
                # Add retry logic for connection issues
                max_retries = 3
                for attempt in range(max_retries):
                    try:
                        print(f"🔄 Transcription attempt {attempt + 1}/{max_retries}")
                        start_time = time.time()
                        
                        transcription = timeout_client.audio.transcriptions.create(
                            file=(audio_path, audio_data),
                            model="whisper-large-v3",
                            temperature=0.09,
                            language="ar",
                            response_format="verbose_json",
                            timestamp_granularities=["segment", "word"],
                        )
                        
                        elapsed_time = time.time() - start_time
                        print(f"✅ Transcription completed in {elapsed_time:.2f} seconds")
                        break
                        
                    except Exception as retry_error:
                        elapsed_time = time.time() - start_time
                        print(f"❌ Transcription attempt {attempt + 1} failed after {elapsed_time:.2f}s: {retry_error}")
                        
                        if attempt == max_retries - 1:
                            # Last attempt failed
                            error_msg = str(retry_error).lower()
                            if "timeout" in error_msg or "connection" in error_msg:
                                raise HTTPException(
                                    status_code=504, 
                                    detail="Transcription timed out. The audio file might be too long or the server is busy. Please try with a shorter video or try again later."
                                )
                            elif "rate limit" in error_msg:
                                raise HTTPException(status_code=429, detail="API rate limit exceeded. Please try again later.")
                            elif "authentication" in error_msg or "unauthorized" in error_msg:
                                raise HTTPException(status_code=401, detail="API authentication failed. Please check API key.")
                            else:
                                raise HTTPException(
                                    status_code=500, 
                                    detail=f"Transcription failed after {max_retries} attempts: {str(retry_error)}"
                                )
                        else:
                            # Wait before retry with exponential backoff
                            wait_time = 2 ** attempt  # 2, 4, 8 seconds
                            print(f"⏳ Waiting {wait_time} seconds before retry...")
                            time.sleep(wait_time)
                            
        except HTTPException:
            raise
        except Exception as e:
            print(f"❌ Transcription failed: {e}")
            print(f"🔍 Error type: {type(e).__name__}")
            raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")

        try:
            transcript_dict = transcription.model_dump()
            parsed_transcript = [
                {"start": s["start"], "end": s["end"], "text": s["text"]}
                for s in transcript_dict["segments"]
            ]
            print(f"📝 Parsed {len(parsed_transcript)} transcript segments")
        except Exception as e:
            print(f"❌ Transcript parsing failed: {e}")
            raise HTTPException(status_code=500, detail=f"Transcript parsing failed: {str(e)}")

        print("🔍 Starting analysis...")
        try:
            result = analyze_all(parsed_transcript)
            print("✅ Analysis completed")
        except Exception as e:
            print(f"❌ Analysis failed: {e}")
            raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

        result_id = uuid.uuid4().hex
        video_results[result_id] = result
        print(f"💾 Results stored with ID: {result_id}")

        return {"message": "Video processed successfully", "id": result_id}

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error processing video: {str(e)}")
        print(f"🔍 Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Video processing failed: {str(e)}")


@app.get("/video/{video_id}")
def get_analysis(video_id: str):
    if video_id not in video_results:
        raise HTTPException(status_code=404, detail="Video ID not found")
    return JSONResponse(content=video_results[video_id])


if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting FastAPI server...")
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
