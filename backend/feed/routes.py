from fastapi import APIRouter, Body, Request, Response, HTTPException, status,  Depends
from fastapi.encoders import jsonable_encoder

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException
import re
from typing import List
import datetime

from fastapi.security.api_key import APIKey
import user.auth as auth

from uuid import uuid4

from user.models import UserModel
from article.models import ArticleModel, ArticleMetaModel 
from metadata.models import MetadataModel
from feed.models import FeedRequestScheme, FeedModel, FeedAddScheme, FeedUpdateScheme, FeedCreateScheme, InterestPrivateChangeScheme
from feed.models import FeedExistsRequest, InterestFeedCreateScheme, InterestFeedModel, InterestFeedUpdateScheme, InterestFeedJoinScheme

import datetime
from dateutil.parser import parse

from feed.curator import curate

router = APIRouter()

def packArticleWMeta(request, user_id, article):
  meta = request.app.database["metadata"].find_one({
    "article_id": article["_id"],
    "user_id": user_id,
  })

  # If we have no metadata on article when we fetch, generate it now
  if meta is None:
    new_meta = request.app.database["metadata"].insert_one(MetadataModel.emptyMetaData(
      article["_id"],
      user_id
    ))
    meta = request.app.database["metadata"].find_one({
      "_id": new_meta.inserted_id
    })
    
  am = ArticleMetaModel(**article, metadata=meta)
  return am

@router.get("/pull/{feed_id}", summary='pull all users current websites for specified feed', status_code=status.HTTP_200_OK)
def pull(request: Request, feed_id: str, skip: int = -1, limit: int = -1, timestamp: int = -1, Authorize: AuthJWT = Depends()):
  user_id = Authorize.get_jwt_subject()
  # pull_request = jsonable_encoder(pull_request)
  
  if timestamp > 0:
    time_ago = datetime.datetime.fromtimestamp(timestamp)
  else:
    time_ago = None

  if user_id:
    feed = request.app.database["feeds"].find_one({
      "_id": feed_id
    })

    if feed is None:
      feed = request.app.database["feeds"].find_one({
        "name": feed_id,
        "private": {"$ne": True}
      })
    if feed is None:
      feed = request.app.database["feeds"].find_one({
        "unique_name": feed_id,
        "private": {"$ne": True}
      })

  else:
    if feed_id == "inbox":
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="inboxes are not public"
      )
    
    feed = request.app.database["feeds"].find_one({
      "name": feed_id,
      "private": {"$ne": True}
    })
    if feed is None:
      feed = request.app.database["feeds"].find_one({
        "unique_name": feed_id,
        "private": {"$ne": True}
      })

  if feed is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="there is no feed with the provided id"
    )

  # day_window = 7
  # if feed["name"] == "inbox":
  #   day_window = 30
  # time_ago = datetime.datetime.now() - datetime.timedelta(days=day_window)
  details = {
    "_id": {"$in": feed["article_ids"]},
    # "creation_time": {"$gt": time_ago}
  }
  if time_ago is not None:
    details["creation_time"] = {"$gt": time_ago}

  articles = request.app.database["articles"].find(details).sort("creation_time", -1)

  articles = list(articles)
  total_articles = len(articles)

  # if skip != -1 and len(articles) > skip+limit:
  #   articles = list(request.app.database["articles"].find({
  #     "_id": {"$in": feed["article_ids"]},
  #     # "creation_time": {"$gt": time_ago}
  #   }).sort("creation_time", -1).skip(skip).limit(limit))


  article_metas = []
  if user_id:
    for article in articles:
      meta = request.app.database["metadata"].find_one({
        "article_id": article["_id"],
        "user_id": user_id,
      })

      # If we have no metadata on article when we fetch, generate it now
      if meta is None:
        new_meta = request.app.database["metadata"].insert_one(MetadataModel.emptyMetaData(
          article["_id"],
          user_id
        ))
        meta = request.app.database["metadata"].find_one({
          "_id": new_meta.inserted_id
        })
        
      am = ArticleMetaModel(**article, metadata=meta)

      am.feed_id = feed["_id"]
      am.feed_name = feed["name"]
      if "interest_feed" in feed and feed["interest_feed"]:
        am.feed_is_interest = True
      else: 
        am.feed_is_interest = False
        
      article_metas.append(am)

    # name = feed["name"]
    # if feed["name"] == "interest":
    #   name = feed["unique_name"]
  else:
    for article in articles:
      meta = MetadataModel.emptyMetaData(
          article["_id"],
          ""
        )
      am = ArticleMetaModel(**article, metadata=meta)
      am.feed_id = feed["_id"]
      am.feed_name = feed["name"]
      if "interest_feed" in feed and feed["interest_feed"]:
        am.feed_is_interest = True
      else: 
        am.feed_is_interest = False
      article_metas.append(am)
      
  return {"articles": article_metas, "total_articles": total_articles}

@router.get("/digest", summary='Get a users entire reading digest', status_code=status.HTTP_200_OK)
def pull(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feeds = request.app.database["feeds"].find({
    "user_ids": user_id
  })

  
  final_articles = []
  for feed in feeds:
    articles = list(request.app.database["articles"].find({
      "_id": {"$in": feed["article_ids"]},
      # "creation_time": {"$gt": time_ago}
    }).sort("creation_time", -1).skip(0).limit(25))
    
    out_articles = []

    for article in articles:
      am = packArticleWMeta(request, user_id, article)

      am.feed_id = feed["_id"]
      am.feed_name = feed["name"]
      if "interest_feed" in feed and feed["interest_feed"]:
        am.feed_is_interest = True
      else: 
        am.feed_is_interest = False

      if not am.metadata.read:
        out_articles.append(am)
    

    final_articles += out_articles

  # Terrible solution for request time, need to optimize
  curated = curate(final_articles, request.app.database)
  return curated

@router.get("/user/{user_id}", summary='Get a users saved articles', status_code=status.HTTP_200_OK)
def pull(request: Request, user_id: str, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  querier_id = Authorize.get_jwt_subject()

  feeds = request.app.database["feeds"].find({
    "user_ids": user_id
  })
  
  final_articles = []
  for feed in feeds:
    articles = list(request.app.database["articles"].find({
      "_id": {"$in": feed["article_ids"]},
      # "creation_time": {"$gt": time_ago}
    }).sort("creation_time", -1))
    
    out_articles = []
    for article in articles:
      am = packArticleWMeta(request, user_id, article)
      if not am.metadata.saved:
        out_articles.append(am)
      
      am.feed_id = feed["_id"]
      am.feed_name = feed["name"]
      if "interest_feed" in feed and feed["interest_feed"]:
        am.feed_is_interest = True
      else: 
        am.feed_is_interest = False
    

    final_articles += out_articles
  
  return final_articles

@router.get("/pull-all", summary='pull all public feeds', status_code=status.HTTP_200_OK)
def pull_all(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feeds = list(request.app.database["feeds"].find({
    "name": {"$ne": "inbox"},
    "interest_feed": {"$ne": True},
  }))

  feed_infos = []
  for feed in feeds:
    snip = {
      "_id": feed["_id"],
      "name": feed["name"],
    }
    
    feed_infos.append(snip)

  return feed_infos

@router.get("/pull-all-interests", summary='pull all interest feeds', status_code=status.HTTP_200_OK)
def pull_all(request: Request, api_key: APIKey = Depends(auth.get_api_key)):
  interests = list(request.app.database["feeds"].find({
    "interest_feed": True,
  }))

  return {"interests": interests}

@router.get("/pull-new-interests", summary='pull all new feeds for you', status_code=status.HTTP_200_OK)
def pull_all(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feeds = list(request.app.database["feeds"].find({
    "name": {"$ne": "inbox"},
    "interest_feed": True,
    "user_ids": {"$ne": user_id},
    "private": {"$ne": True}
  }).limit(50))

  feed_infos = []
  for feed in feeds:
    snip = {
      "_id": feed["_id"],
      "name": feed["name"],
      "interest_feed": True,
      "query_content": feed["query_content"],
      "unique_name": feed["unique_name"],
      "author_id": feed["author_id"],
      "private": feed["private"],
    }
    feed_infos.append(snip)

  return feed_infos

@router.post("/create-interest", summary='create a new interest', status_code=status.HTTP_200_OK)
def create_interest(request: Request, feed_request: InterestFeedCreateScheme = Body(...), Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()
  feed_request = jsonable_encoder(feed_request)

  unique_name = re.sub(r'\W+', '', feed_request["query_content"]).replace(" ", "-")
  orig_unique = unique_name
  existing_feed = request.app.database["feeds"].find_one({
    "unique_name": unique_name
  })
  while existing_feed is not None:
    unique_name = orig_unique + str(uuid4()) [:6]
    existing_feed = request.app.database["feeds"].find_one({
      "unique_name": unique_name
    })

  new_feed = request.app.database["feeds"].insert_one(InterestFeedModel.emptyFeed("interest", feed_request["query_content"], unique_name, user_id))

  feed = request.app.database["feeds"].find_one({
    "_id": new_feed.inserted_id
  })
  return feed

@router.post("/join-interest", summary='join an existing interest', status_code=status.HTTP_200_OK)
def create_interest(request: Request, feed_request: InterestFeedJoinScheme = Body(...), Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()
  feed_request = jsonable_encoder(feed_request)
  unique_name = feed_request["unique_name"]
  feed = request.app.database["feeds"].find_one({
    "unique_name": unique_name
  })
  if feed is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="There is no interest with the provided id"
    )
  
  if "user_ids" not in feed:
    feed["user_ids"] = []
  if user_id not in feed["user_ids"]:
    feed["user_ids"].append(user_id)
  request.app.database["feeds"].update_one({"_id": feed["_id"]}, {"$set": feed})
  
  return feed

@router.post("/update-interest/{feed_id}", summary='update an interest', status_code=status.HTTP_200_OK)
def create_interest(request: Request, update_req: InterestFeedUpdateScheme = Body(...), Authorize: AuthJWT = Depends()):
  update_info = jsonable_encoder(update_req)
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()
  print("Info: ", update_info)
  interest = request.app.database["feeds"].find_one({
    "_id": update_info["_id"]
  })

  if interest["author_id"] != user_id:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You are not the author of this interest"
    )

  for key, value in update_info.items():
    if key != "_id" and value != None:
      interest[key] = value
  
  request.app.database["feeds"].update_one({"_id": interest["_id"]}, {"$set": interest})
  return interest

@router.post("/change-interest-private", summary='update an interest', status_code=status.HTTP_200_OK)
def create_interest(request: Request, update_req: InterestPrivateChangeScheme = Body(...), Authorize: AuthJWT = Depends()):
  update_info = jsonable_encoder(update_req)
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  interest = request.app.database["feeds"].find_one({
    "_id": update_info["feed_id"]
  })

  if interest["author_id"] != user_id:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You are not the author of this interest"
    )

  interest["private"] = update_info["private"]
  
  request.app.database["feeds"].update_one({"_id": interest["_id"]}, {"$set": interest})
  return interest

@router.post("/delete-feed/{feed_id}", summary='delete a feed', status_code=status.HTTP_200_OK)
def delete_interest(request: Request, update_req: FeedUpdateScheme = Body(...), Authorize: AuthJWT = Depends()):
  update_info = jsonable_encoder(update_req)
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feed = request.app.database["feeds"].find_one({
    "_id": update_info["_id"]
  })
   
  if user_id in feed["user_ids"]:
    feed["user_ids"].remove(user_id)

  if len(feed["user_ids"]) > 0:

    if feed["interest_feed"] and user_id == feed["author_id"] and len(feed["user_ids"]) > 0:
        feed["author_id"] = feed["user_ids"][0]

    request.app.database["feeds"].update_one({"_id": feed["_id"]}, {"$set": feed})
  else: 
    if feed["interest_feed"]:
      request.app.database["feeds"].delete_one({"_id": feed["_id"]})
    else:
      request.app.database["feeds"].update_one({"_id": feed["_id"]}, {"$set": feed})

  return feed

@router.post("/server-update-interest/{feed_id}", summary='update an interest', status_code=status.HTTP_200_OK)
def create_interest(request: Request, update_req: InterestFeedUpdateScheme = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  update_info = jsonable_encoder(update_req)
  interest = request.app.database["feeds"].find_one({
    "_id": update_info["_id"]
  })

  for key, value in update_info.items():
    if key != "_id" and value != None:
      interest[key] = value
  
  request.app.database["feeds"].update_one({"_id": interest["_id"]}, {"$set": interest})
  return interest
  

@router.post("/check-exists", summary='check if an feed exists', status_code=status.HTTP_200_OK)
def add_to_inbox(request: Request, exists_req: FeedExistsRequest = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  req = jsonable_encoder(exists_req)
  
  if req["feed_name"]:
    feed = request.app.database["feeds"].find_one({
      "name": req["feed_name"]
    })
  else:
    feed = request.app.database["feeds"].find_one({
      "_id": req["feed_id"]
    })

  if feed is None:
    return {"exists": False, "feed": {}}

  return {"exists": True, "feed": feed}

@router.post("/mark-updated", summary='mark a feed as having been updated', status_code=status.HTTP_200_OK)
def add_to_inbox(request: Request, exists_req: FeedUpdateScheme = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  req = jsonable_encoder(exists_req)
  id = req["_id"]
  print("SEARCHING FOR ", id)

  feed = request.app.database["feeds"].find_one({
    "_id": id
  })
  if feed is None:
    return {"should_update": False, "feed": {}}
  
  feed["last_updated"] = datetime.datetime.now()
  request.app.database["feeds"].update_one({"_id": feed["_id"]}, {"$set": feed})

  last_ten_articles = list(request.app.database["articles"].find({
    "_id": {"$in": feed["article_ids"]}
  }).sort("creation_time", -1).limit(5))

  last_ten_articles_metadata = []
  for article in last_ten_articles:
    metas_per_art = request.app.database["metadata"].find({
      "article_id": article["_id"],
    })
    for meta in metas_per_art:
      last_ten_articles_metadata.append(meta)

  shouldUpdate = False
  for meta in last_ten_articles_metadata:
    if meta["read"] == True:
      shouldUpdate = True
      break

  return {"should_update": shouldUpdate, "feed": feed}

@router.post("/create", summary='creating feed', status_code=status.HTTP_201_CREATED,response_model=FeedModel)
def add(request: Request, feed_request: FeedCreateScheme = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  feed_request = jsonable_encoder(feed_request)
  new_feed = request.app.database["feeds"].insert_one(FeedModel.emptyFeed(feed_request["feed_name"]))
  feed = request.app.database["feeds"].find_one({
    "_id": new_feed.inserted_id
  })
  return feed


@router.post("/add", summary='adding article / user to a feed', status_code=status.HTTP_200_OK,response_model=FeedModel)
def add(request: Request, feed_request: FeedAddScheme = Body(...), Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  feed_request = jsonable_encoder(feed_request)

  # print("FEED ID: ", feed_request["feed_id"])
  feed = request.app.database["feeds"].find_one({
    "_id": feed_request["feed_id"]
  })
  if feed is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="there is no feed with the provided id"
    )
  
  if feed_request["type"] == "article":
    article = request.app.database["articles"].find_one({
      "_id": feed_request["addition_id"]
    })
    if article is None:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="there is no article with the provided id"
      )
    if article["_id"] in feed["article_ids"]:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="article already part of feed"
      )
    feed["article_ids"].append(article["_id"])

  elif feed_request["type"] == "user":
    user = request.app.database["users"].find_one({
      "_id": feed_request["addition_id"]
    })
    if user is None:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="there is no user with the provided id"
      )
    if user["_id"] in feed["user_ids"]:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="user already part of feed"
      )
    feed["user_ids"].append(user["_id"])
  
  update_result = request.app.database["feeds"].update_one({"_id": feed["_id"] }, {"$set": {
    "user_ids": feed["user_ids"],
    "article_ids": feed["article_ids"],
  }})

  if update_result.modified_count == 0:
    raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=f"Feed has not been modified")

  print(feed)
  return feed
