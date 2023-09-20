from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database):
    users_collection = database['users']
    all_users = users_collection.find()

    
    for user in all_users:
        users_collection.update_one(
            {'_id': user['_id']},
            {'$set': {
                'playback_speed': 1.0
            }}
        )


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    database = mongodb_client[config["MONGO_DB"]]
    migrate(database)
    mongodb_client.close()