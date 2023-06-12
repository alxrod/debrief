import os
import time
import tiktoken

from dotenv import load_dotenv
from audio_generator import AudioGenerator


if __name__ == '__main__':
  load_dotenv()

  url = "https://www.ai21.com/blog/human-or-not-results"
  audio_gen = AudioGenerator()
  print("Testing w url: ", url)

  title, summary, fname = audio_gen.output_summary(url)
  print("Title: ", title)