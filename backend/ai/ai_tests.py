import os
import time
import tiktoken

from dotenv import load_dotenv
from audio_generator import AudioGenerator


if __name__ == '__main__':
  load_dotenv()

  url = "https://www.ai21.com/blog/human-or-not-results"
  audio_gen = AudioGenerator()
  
  html = audio_gen.get_html(url)
  preprocessed = audio_gen.preprocess(html)
  print("Token count is: ", audio_gen.num_tokens_from_string(preprocessed, "cl100k_base"))
  
  audio_gen.writeIntermediate(preprocessed, "test_preprocessed.txt")

  title, summary, output_name = audio_gen.output_summary(url)
  print("Title: ", title, "\nSummary: ", summary, "\nOutput name: ", output_name)