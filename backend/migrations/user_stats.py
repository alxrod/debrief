from pymongo import MongoClient
from dotenv import dotenv_values
from datetime import datetime, timedelta

config = dotenv_values(".env")

def migrate(database):
    users_collection = database['users']

    art_collection = database['article_stats']
    sessions_collection = database['sessions']

    users = list(users_collection.find())
    user_article_stats = {}
    for user in users:
        user_id = user['_id']
        user_stats = len(list(art_collection.find({'user_id': user_id})))
        user_article_stats[user_id] = user_stats
    
    user_most_recent_session = {}
    for user in users:
        user_id = user['_id']
        user_sessions = sessions_collection.find({'user_id': user_id})
        most_recent_end_time = None
        for session in user_sessions:
            if most_recent_end_time is None or session['end_time'] > most_recent_end_time:
                most_recent_end_time = session['end_time']
        user_most_recent_session[user_id] = most_recent_end_time

    
    for user in users:
        time = user_most_recent_session[user["_id"]]
        if time is None:
            time = "never"
        else:
            time = time.strftime("%m/%d %I:%M %p")
        
        name = user["email"] + "".join(" "*max(0, 45 - len(user["email"])))
        count = str(user_article_stats[user["_id"]]) + "".join(" "*max(0, 20 - len(str(user_article_stats[user["_id"]]))))

        print(
            name, 
            "| arts listened: ", count, 
            "| last on: ", time)
    
    


if __name__ == "__main__":
    mongodb_client = MongoClient("mongodb://127.0.0.1:27018")
    database = mongodb_client["debrief_prod"]
    migrate(database)
    mongodb_client.close()