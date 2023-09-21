from ai.feeds.instances.hackernews import HackerNewsFeed
from ai.feeds.instances.theverge import TheVergeFeed
from ai.feeds.instances.theguardian import TheGuardianFeed
from ai.interest_manager import InterestManager
import threading

from dotenv import dotenv_values
import requests
import time
import datetime
import json
from dateutil.parser import parse
# REFRESH_TIME = 60 * 30
REFRESH_TIME = 1

INTEREST_REFRESH_RATE = 60 * 60 * 6
FEED_REFRESH_RATE = 60 * 60 * 6

class FeedPoster:
  def __init__(self, access_token, site_base):
    self.token = access_token
    self.base_url = site_base

  def create_feed(self, name):
    url = self.base_url + "/feed/create"
    head = {'access_token': self.token}
    resp = requests.post(url, json={
      "feed_name": name,
    }, headers=head)

    if resp.status_code == 201:
      body = resp.json()
      return True, body
    return False, {}

  def feed_exists(self, name):
      url = self.base_url + "/feed/check-exists"
      head = {'access_token': self.token}
      params = {
        "feed_name": name
      }
      resp = requests.post(url, json=params, headers=head)
      if resp.status_code == 200:
        body = resp.json()
        if "exists" in body:
          return body["exists"], body["feed"]
      return False, {}


if __name__ == "__main__":
  feeds = {
    "hackernews": HackerNewsFeed(),
    "theverge": TheVergeFeed(),
    "theguardian": TheGuardianFeed(),
  }
  config = dotenv_values(".env")

  poster = FeedPoster(config["API_KEY"], config["API_URL"])

  # Setup feeds:
  print("Configuring Main Feeds")
  for name, obj in feeds.items():
    exists, existing_feed = poster.feed_exists(name)
    if not exists:
      success, new_feed = poster.create_feed(name)
      if success:
        print("Created feed: ", new_feed["name"])
        obj.feed_id = new_feed["_id"]
        obj.last_updated = datetime.datetime.now() - datetime.timedelta(days=365)
      else:
        print("Failed to create feed: ", name)
    else:
      print("Feed already exists: ", name)
      obj.feed_id = existing_feed["_id"]
      obj.last_updated = parse(existing_feed["last_updated"])

  # # Setup interests 
  print("Pulling all active feeds")
  interest_manager = InterestManager(config["API_KEY"], config["API_URL"])
  interest_manager.get_feeds()


  print("\n")

  threads = []
  THREAD_CAP = 10

  while True:

    try:

      need_to_ingest = []

      for name, obj in feeds.items():
        now = datetime.datetime.now()
        if (now - obj.last_updated).total_seconds() > FEED_REFRESH_RATE:
          # obj.ingest(url_cache, stats)
          need_to_ingest.append(obj)

    
      interest_manager.get_new_feeds()
    

      for interest in interest_manager.interest_feeds:
        now = datetime.datetime.now()
        if (now - interest.last_updated).total_seconds() > INTEREST_REFRESH_RATE:      
          # interest.ingest(url_cache, stats)
          need_to_ingest.append(interest)

      while need_to_ingest:
        if len(threads) < THREAD_CAP:
      #     print("Spawning thread")
          obj = need_to_ingest.pop(0)

          thread = threading.Thread(target=obj.ingest)
          threads.append(thread)
          thread.start()


        if len(threads) > 1:
          for thread in threads:
            if not (thread.is_alive()):
              print("Thread has completed running")
              thread.join()
              threads.remove(thread) 
        time.sleep(0.1)         

      time.sleep(REFRESH_TIME)
    
    except Exception as error:
        print("Scraper failed for reason: ", error)
        time.sleep(10)
