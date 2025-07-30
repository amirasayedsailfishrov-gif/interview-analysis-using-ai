# AI Interview Analyzer - Full Stack Integration

This project integrates a Next.js frontend with a FastAPI backend to provide AI-powered interview video analysis in Arabic.

## Features

- **Video Upload**: Drag and drop or browse to upload interview videos
- **AI Transcription**: Uses Groq's Whisper model for Arabic speech-to-text
- **Sentiment Analysis**: Analyzes emotional tone of the interview
- **Speech Pattern Analysis**: Calculates speech rate and word frequency
- **Sensitive Word Detection**: Identifies security-related terms
- **Translation**: Provides English translation of Arabic content
- **Bilingual Interface**: Supports both Arabic and English

## Setup Instructions

### Backend Setup (FastAPI)

1. **Navigate to the API directory:**
   ```bash
   cd api
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the FastAPI server:**
   ```bash
   python run_server.py
   ```
   
   Or manually:
   ```bash
   uvicorn main:app --host 127.0.0.1 --port 8000 --reload
   ```

   The API will be available at: `http://localhost:8000`

### Frontend Setup (Next.js)

1. **Navigate to the project root:**
   ```bash
   cd ..
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

   The frontend will be available at: `http://localhost:3000`

## API Endpoints

### POST /video
Upload a video file for analysis.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: `video` (file)

**Response:**
```json
{
  "message": "Video processed successfully",
  "id": "unique-video-id"
}
```

### GET /video/{video_id}
Retrieve analysis results for a processed video.

**Response:**
```json
{
  "sentiment": {
    "positive": "45.5%",
    "neutral": "32.1%", 
    "negative": "22.4%"
  },
  "total_words": 245,
  "frequent_words": [["word", count], ...],
  "speech_rate_wps": 2.35,
  "sensitive_words": [...],
  "translation": [...]
}
```

## Usage Flow

1. **Start both servers** (backend on :8000, frontend on :3000)
2. **Access the website** at http://localhost:3000
3. **Click "Try Now"** or any upload button
4. **Upload a video file** (MP4, MOV, AVI, MKV up to 100MB)
5. **Wait for processing** (transcription + analysis)
6. **View comprehensive results** including:
   - Sentiment analysis breakdown
   - Speech rate metrics
   - Word frequency analysis
   - Sensitive word alerts
   - English translation

## Project Structure

```
├── api/                     # FastAPI Backend
│   ├── main.py             # FastAPI app with CORS
│   ├── analysis.py         # AI analysis functions
│   ├── utils.py            # Video/audio utilities
│   ├── memory_store.py     # In-memory result storage
│   ├── requirements.txt    # Python dependencies
│   ├── run_server.py       # Server startup script
│   └── uploads/            # Uploaded files storage
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page with upload/results
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   └── ui/               # Shadcn/ui components
├── lib/                  # Utilities
└── public/              # Static assets
```

## Technology Stack

**Frontend:**
- Next.js 15 with App Router
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Lucide React icons

**Backend:**
- FastAPI (Python)
- Groq API (Whisper for transcription)
- TextBlob (sentiment analysis)
- Deep Translator (Arabic-English)
- MoviePy (video processing)

## Environment Variables

The Groq API key is currently hardcoded. For production, set:

```bash
export GROQ_API_KEY="your-groq-api-key-here"
```

## Troubleshooting

1. **CORS errors**: Ensure both servers are running on the correct ports
2. **Upload failures**: Check file size (100MB limit) and format (MP4/MOV/AVI/MKV)
3. **Analysis errors**: Verify Groq API key is valid
4. **Dependency issues**: Use Python 3.8+ and Node.js 18+

## Security Notes

- API key should be moved to environment variables
- File uploads are stored locally (consider cloud storage for production)
- No authentication implemented (add for production use)
- CORS is configured for localhost only
