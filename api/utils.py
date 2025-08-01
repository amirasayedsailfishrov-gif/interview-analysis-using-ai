from moviepy.editor import VideoFileClip
import os
import uuid
import tempfile

def extract_audio(video_path):
    audio_filename = f"{uuid.uuid4().hex}_audio.wav"
    # Use temp directory instead of uploads folder
    audio_output_path = os.path.join(tempfile.gettempdir(), audio_filename)
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_output_path, logger=None)
    return audio_output_path
