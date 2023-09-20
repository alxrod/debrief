from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database, id):
    feeds_collection = database['feeds']
    metadata_collection = database['metadata']
    art_collection = database['articles']

    feed = feeds_collection.find_one({'_id': id})    

    articles = art_collection.find({'_id': {'$in': feed['article_ids']}})

    out_arts = []
    for article in articles:
        metadata = metadata_collection.find_one({'article_id': article['_id']})
        if metadata:
          article['metadata'] = metadata
        out_arts.append(article)
    
    return out_arts
    


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    database = mongodb_client[config["MONGO_DB"]]
    articles = migrate(database, input("Enter feed id: "))
    print("Found ", len(articles))
    
    for article in sorted(articles, key=lambda x: x['metadata']['read'] if 'metadata' in x and 'read' in x['metadata'] else False):
        if "metadata" in article:
          read_stat = article["metadata"]["read"]
        else:
          read_stat = False

        print(article["_id"], " ", read_stat)
        
    mongodb_client.close()