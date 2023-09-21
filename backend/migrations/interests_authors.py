from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database):
    feeds_collection = database['feeds']
    all_feeds = feeds_collection.find()

    
    for feed in all_feeds:
        if "interest_feed" in feed and feed['interest_feed']:

          if len(feed["user_ids"]) == 0:
            feeds_collection.delete_one({'_id': feed['_id']})
          else:
            feeds_collection.update_one(
              {'_id': feed['_id']},
              {'$set': {
                'author_id': feed["user_ids"][0], 
              }}
            )


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    database = mongodb_client[config["MONGO_DB"]]
    migrate(database)
    mongodb_client.close()