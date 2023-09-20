import pandas as pd
from pymongo import MongoClient
from dotenv import dotenv_values

config = dotenv_values(".env")
client = MongoClient("mongodb://127.0.0.1:27018")
database = client["debrief_prod"]

stats = database["article_stats"].find({})
by_article = []

article_id_list =[]
article_title_list =[]
artitle_summary_list =[]
skip_forwards_list = []
skip_backwards_list = []
average_skip_perc_list = []
saves_list = []
listens_list = []
unique_users_list = []
archives_list = []

for art_stat in stats:


  article_id = art_stat["article_id"]
  user_id = art_stat["user_id"]
  skip_forwards = art_stat["skip_forwards"]
  skip_backwards = art_stat["skip_backwards"]
  if "average_skip_perc" not in art_stat:
    art_stat["average_skip_perc"] = 0
  average_skip_perc = art_stat["average_skip_perc"]
  listens = art_stat["listens"]

  metadata = database["metadata"].find_one({"article_id": article_id, "user_id": user_id})
  article = database["articles"].find_one({"_id": article_id})

  saved = metadata["saved"]
  archived = metadata["archived"]
  article_title = article["title"]
  article_summary = article["summary"]

  if article_id in article_id_list:
    index = article_id_list.index(article_id)

    skip_forwards_list[index] += skip_forwards
    skip_backwards_list[index] += skip_backwards
    average_skip_perc_list[index] = (average_skip_perc_list[index]*unique_users_list[index] + average_skip_perc) / (unique_users_list[index] + 1)
    listens_list[index] += listens
    unique_users_list[index] += 1

    if saved:
      saves_list[index] += 1
    if archived:
      archives_list[index] += 1
  
  else:
    article_id_list.append(article_id)
    article_title_list.append(article_title)
    artitle_summary_list.append(article_summary)
    skip_forwards_list.append(skip_forwards)
    skip_backwards_list.append(skip_backwards)
    average_skip_perc_list.append(average_skip_perc)
    listens_list.append(listens)
    unique_users_list.append(1)
    if saved:
      saves_list.append(1)
    else:
      saves_list.append(0)
    if archived:
      archives_list.append(1)
    else:
      archives_list.append(0)
    
  
dict_frame = {
  "article_id": article_id_list,
  "article_title": article_title_list,
  "article_summary": artitle_summary_list,
  "skip_forwards": skip_forwards_list,
  "skip_backwards": skip_backwards_list,
  "average_skip_perc": average_skip_perc_list,
  "listens": listens_list,
  "unique_users": unique_users_list,
  "saves": saves_list,
  "archives": archives_list
}
  
results_df = pd.DataFrame(dict_frame)
results_df.to_csv("article_stats.csv", index=False)