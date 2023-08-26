from ai.feeds.audio_poster import AudioPoster
from dotenv import dotenv_values
from ai.audio_generator import AudioGenerator
from ai.uploader import Uploader
import uuid
from ai.main_generator import MainGenerator
from urllib.parse import urlparse

class FeedObject(object):
  def __init__(self, feed_id=""):
    self.generator = MainGenerator()
    self.feed_id = feed_id
  
  def check_in_feed(self, url):
    exists = self.generator.poster.check_article_exists(url, self.feed_id)
    return exists

  def add_url(self, url):
    return self.generator.ingest(url, feed_id=self.feed_id, lossy=True)

  def fetch(self):
    return []
  
  def remove_query_params(self, url):
    parsed_url = urlparse(url)
    return parsed_url.scheme + "://" + parsed_url.netloc + parsed_url.path
  
  def ingest(self, url_cache, stats):
    new_urls = self.fetch()

    new_urls = [self.remove_query_params(url) for url in new_urls]
    new_urls = list(set(new_urls))
    
    unentered_urls = []

    for url in new_urls:
      if url not in url_cache:
        if not self.check_in_feed(url):
          unentered_urls.append(url)
        url_cache.append(url)
      
    print("Ingesting ", len(unentered_urls), " new articles")
    for url in unentered_urls:
      if not self.add_url(url):
        print("Failed to ingest ", len(url))
        stats["failed_count"] += 1
        stats["failed_articles_list"].append(url)
      else:
        stats["success_count"] += 1
    
    # return url_cache
