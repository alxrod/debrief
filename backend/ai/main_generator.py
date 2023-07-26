import uuid

from dotenv import dotenv_values
from ai.audio_generator import AudioGenerator
from ai.uploader import Uploader
from ai.feeds.audio_poster import AudioPoster

import time

class MainGenerator:
  def __init__(self):
    config = dotenv_values(".env")

    self.ag = AudioGenerator()
    self.uploader = Uploader()
    self.poster = AudioPoster(config["API_KEY"], config["API_URL"])
  
  def generate(self, url, lossy=False):
    html = self.ag.get_html(url, lossy=lossy)
    title = self.ag.get_title(html)

    title, summary, output_name, error = self.ag.output_summary(url, lossy)
    
    if lossy and (summary == "" or error or title == ""):
      return {}, "", True

    article = {
      "raw_link": url,
      "title": title,
      "summary": summary,
    }

    return article, output_name, False

  def ingest(self, url, feed_id="", email="", lossy=False):
    # Check bucket for generated audio clip so we don't accidentally regenerate'
    in_bucket, article = self.uploader.check_bucket(url)
    if not in_bucket:
      article, temp_file, error = self.generate(url, lossy)
      if lossy and error:
        return False

      article, uploaded = self.uploader.upload(temp_file, article)
    else:
      print("Article already exists, just posting to feed")

    article["summary_uploaded"] = True
  
    if feed_id != "":
      self.poster.save_new_article(feed_id, article)
    elif email != "":
      self.poster.post_audio(email, article)
    else:
      raise Exception("Must provide either feed_id or email for ingest")
    
    return True



