#!/usr/bin/env python3
"""
Test script for the AI Interview Analyzer API
"""

import requests
import json

# Test the API endpoint
def test_api():
    base_url = "http://localhost:8000"
    
    # Test health check (if API is running)
    try:
        response = requests.get(f"{base_url}/docs")
        if response.status_code == 200:
            print("✅ API server is running successfully!")
            print(f"📍 API Documentation: {base_url}/docs")
            print(f"📍 Frontend should connect to: {base_url}")
        else:
            print("❌ API server responded but with error")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to API server")
        print("💡 Make sure to run: python run_server.py")
    except Exception as e:
        print(f"❌ Error testing API: {e}")

if __name__ == "__main__":
    print("🧪 Testing AI Interview Analyzer API...")
    test_api()
