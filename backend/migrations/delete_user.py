from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database, id):
    users_collection = database['users']

    feeds_collection = database['feeds']
    metadata_collection = database['metadata']
    art_collection = database['article_stats']
    sessions_collection = database['sessions']

    specific_user = users_collection.find_one({'_id': id})
    
    user_feeds = feeds_collection.find({'user_ids': specific_user['_id']})
    for feed in user_feeds:
        feed['user_ids'].remove(specific_user['_id'])
        feeds_collection.update_one(
            {'_id': feed['_id']},
            {'$set': {
                'user_ids': feed['user_ids']
            }}
        )
    

    user_metadatas = metadata_collection.find({'user_id': specific_user['_id']})
    for metadata in user_metadatas:
        metadata_collection.delete_one(
            {'_id': metadata['_id']}
        )
    
    user_arts = art_collection.find({'user_id': specific_user['_id']})
    for art in user_arts:
        art_collection.delete_one(
            {'_id': art['_id']}
        )
    
    user_sessions = sessions_collection.find({'user_id': specific_user['_id']})
    for session in user_sessions:
        sessions_collection.delete_one(
            {'_id': session['_id']}
        )
    
    users_collection.delete_one({'_id': specific_user['_id']})


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    database = mongodb_client[config["MONGO_DB"]]
    migrate(database, input("Enter user id: "))
    mongodb_client.close()