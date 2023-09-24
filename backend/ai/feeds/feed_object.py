from ai.feeds.audio_poster import AudioPoster
from dotenv import dotenv_values
from ai.audio_generator import AudioGenerator
from ai.uploader import Uploader
import uuid
from ai.main_generator import MainGenerator
from urllib.parse import urlparse
from datetime import datetime
from dateutil.parser import parse
import threading

class FeedObject(object):
  def __init__(self, feed_id=""):
    self.generator = MainGenerator()
    self.feed_id = feed_id
    self.last_updated = None

    self.blacklist = [
      "nytimes.com"
    ]
  
  def check_in_feed(self, url):
    exists = self.generator.poster.check_article_exists(url, self.feed_id)
    return exists

  def mark_feed_updated(self):
    should_update, feed = self.generator.poster.mark_feed_updated(self.feed_id)
    if "last_updated" in feed:
      self.last_updated = parse(feed["last_updated"])
      if self.last_updated == None:
        print("error marking feed updated, setting it current locally")
        self.last_updated = datetime.now()

    return should_update
    

  def add_url(self, url):
    return self.generator.ingest(url, feed_id=self.feed_id, lossy=True)

  def fetch(self):
    return []
  
  def remove_query_params(self, url):
    parsed_url = urlparse(url)
    return parsed_url.scheme + "://" + parsed_url.netloc + parsed_url.path
  
  def ingest(self):
    print("Starting thread ", threading.get_native_id(), " to handle feed ", self.feed_id)
    
    should_update = self.mark_feed_updated()
    if should_update == False:
      print("Skipping ingestion for feed ", self.feed_id, " since no user has read since last update")

    new_urls = self.fetch()
    new_urls = [self.remove_query_params(url) for url in new_urls]
    new_urls = list(set(new_urls))
    
    cleaned_urls = []
    for url in new_urls:
      if not any([blacklist in url for blacklist in self.blacklist]):
        cleaned_urls.append(url)
    new_urls = cleaned_urls
    
    unentered_urls = []


    for url in new_urls:
      if not self.check_in_feed(url):
        unentered_urls.append(url)
      
    print(self.feed_id, ": ingesting ", len(unentered_urls), " new articles")
    for url in unentered_urls:
      self.add_url(url)
