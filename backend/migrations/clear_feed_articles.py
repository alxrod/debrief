from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database):
    feeds_collection = database['feeds']

    feeds = feeds_collection.find({})
    
    for feed in feeds:
        if not feed["interest_feed"]:
          feed['article_ids'] = []
          feeds_collection.update_one(
              {'_id': feed['_id']},
              {'$set': {
                  'article_ids': []
              }}
          )
    


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    database = mongodb_client[config["MONGO_DB"]]
    print("Clearing all articles from feeds")
    articles = migrate(database)
    mongodb_client.close()