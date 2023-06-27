from pymongo.mongo_client import MongoClient
from bson.objectid import ObjectId

from pymongo import MongoClient
from bson.json_util import dumps
from datetime import datetime, timezone
from datetime import timedelta

import os

class FeedManager():
    
  def __init__(self):
    db_ip = os.getenv("DB_IP")
    self.db_name = os.getenv("DB_NAME")

    db_url = "mongodb://"+db_ip+":27017"

    self.dbClient = MongoClient(db_url)

    try:
      self.dbClient.admin.command('ping')
      print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
      print(e)
      exit(1)
    
    self.fetchers = []

  def generateFeed(self, feed_name):
    mydb = self.dbClient[self.db_name]
    mycol = mydb["feeds"]

    feedQuery = { "name": feed_name}

    myFeed = mycol.find_one(feedQuery)
    if myFeed:
      print("Feed already exists w name ", feed_name)
      return     
    
    newFeed = {
      "name": feed_name,
      "lastAddition": datetime.now(),
    }
    mycol.insert_one(newFeed)

  def subtractExistingUrls(self, feed_name, urls):
    mydb = self.dbClient[self.db_name]

    sitesQuery = {"$and": [
      {"feeds": feed_name}, 
      {"raw_link":  {"$in": urls}} 
    ]}
    existingSites = mydb["websites"].find(sitesQuery)
  
    return [x for x in urls if x not in [y["raw_link"] for y in list(existingSites)]]
  

  def collectUrls(self, feed_name, urls):
    mydb = self.dbClient[self.db_name]

    sitesQuery = {"$and": [
      {"feeds": feed_name}, 
      {"raw_link":  {"$in": urls}} 
    ]}
    existingSites = mydb["websites"].find(sitesQuery)
  
    return [x for x in urls if x not in [y["raw_link"] for y in list(existingSites)]]

if __name__ == "__main__":
  fm = FeedManager()
  # fm.generateFeed("test_feed")
  print(fm.subtractExistingUrls("test_feed", ["https://www.mermaidchart.com/blog/posts/sequence-diagrams-the-good-thing-uml-brought-to-software-development"]))