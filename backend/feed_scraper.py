from ai.feeds.hackernews import HackerNewsFeed
from dotenv import dotenv_values
import requests
import time

import json

# REFRESH_TIME = 60 * 30
REFRESH_TIME = 1

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
  feeds = {"hackernews": HackerNewsFeed()}
  config = dotenv_values(".env")

  poster = FeedPoster(config["API_KEY"], config["API_URL"])

  # Setup feeds:
  for name, obj in feeds.items():
    exists, existing_feed = poster.feed_exists(name)
    if not exists:
      success, new_feed = poster.create_feed(name)
      if success:
        print("Created feed: ", new_feed["name"])
        obj.feed_id = new_feed["_id"]
      else:
        print("Failed to create feed: ", name)
    else:
      print("Feed already exists: ", name)
      obj.feed_id = existing_feed["_id"]

  url_cache = []
  stats = {}

  with open("stats.json", "r") as file:
    stats = json.load(file)

  while True:

    for name, obj in feeds.items():
      obj.ingest(url_cache, stats)
    
    with open("stats.json", "w") as file:
        json.dump(stats, file)

    time.sleep(REFRESH_TIME)
