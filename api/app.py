#!/usr/bin/env python3
"""
Hugging Face Spaces deployment file
This file should be in the root of your Hugging Face Space repository
"""

import os
import sys
import uvicorn
from pathlib import Path

# Add the current directory to Python path
sys.path.append(str(Path(__file__).parent))

# Import your FastAPI app
from main import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))  # Hugging Face Spaces uses port 7860
    uvicorn.run(
        app, 
        host="0.0.0.0", 
        port=port
    )
