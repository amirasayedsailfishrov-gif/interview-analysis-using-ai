from moviepy.editor import VideoFileClip
import os
import uuid

def extract_audio(video_path):
    audio_filename = f"{uuid.uuid4().hex}_audio.wav"
    audio_output_path = os.path.join("uploads", audio_filename)
    video_clip = VideoFileClip(video_path)
    video_clip.audio.write_audiofile(audio_output_path, logger=None)
    return audio_output_path
