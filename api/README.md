---
title: AI Interview Analyzer API
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
license: mit
---

# AI Interview Analyzer API

🤖 AI-powered interview analysis API that processes video files, extracts Arabic speech using Groq's Whisper model, and provides comprehensive analysis including sentiment analysis, speech patterns, and professional skill assessment.

## Features

- **Video Processing**: Upload and process interview videos
- **Arabic Speech Recognition**: Uses Groq's Whisper-large-v3 model
- **AI Analysis**: Sentiment analysis, speech patterns, and skill assessment
- **FastAPI Backend**: High-performance async API
- **CORS Enabled**: Ready for frontend integration

## API Endpoints

- `GET /` - Health check and status
- `GET /test` - Test Groq API connection
- `POST /video` - Upload and analyze video
- `GET /video/{video_id}` - Get analysis results

## Environment Variables

- `GROQ_API_KEY` - Your Groq API key for speech processing

## Usage

The API accepts video files and returns comprehensive analysis results including transcription, sentiment analysis, and professional skill assessments.
