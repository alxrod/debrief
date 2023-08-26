from fastapi import APIRouter, Body, Request, Response, HTTPException, status,  Depends
from fastapi.encoders import jsonable_encoder

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from typing import List
import datetime

from fastapi.security.api_key import APIKey
import user.auth as auth

from uuid import uuid4

from user.models import UserModel
from article.models import ArticleModel, ArticleMetaModel 
from metadata.models import MetadataModel
from feed.models import FeedRequestScheme, FeedModel, FeedAddScheme, FeedCreateScheme, FeedExistsRequest

import datetime

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
def pull(request: Request, feed_id: str, skip: int = -1, limit: int = -1, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feed = request.app.database["feeds"].find_one({
    "_id": feed_id
  })
  if feed is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="there is no feed with the provided id"
    )
  else:
    print("Querying feed ", feed["name"], " with ", len(feed["article_ids"]), " articles")

  # day_window = 7
  # if feed["name"] == "inbox":
  #   day_window = 30
  # time_ago = datetime.datetime.now() - datetime.timedelta(days=day_window)
  articles = request.app.database["articles"].find({
    "_id": {"$in": feed["article_ids"]},
    # "creation_time": {"$gt": time_ago}
  }).sort("creation_time", -1)


  
  articles = list(articles)
  total_articles = len(articles)

  if skip != -1 and len(articles) > skip+limit:
    articles = list(request.app.database["articles"].find({
      "_id": {"$in": feed["article_ids"]},
      # "creation_time": {"$gt": time_ago}
    }).sort("creation_time", -1).skip(skip).limit(limit))


  article_metas = []
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
    article_metas.append(am)

  print(len(article_metas))
  return {"articles": article_metas, "total_articles": total_articles}

@router.get("/digest", summary='Get a users entire reading digest', status_code=status.HTTP_200_OK)
def pull(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feeds = request.app.database["feeds"].find({
    "user_ids": user_id
  })

  
  final_articles = {}
  for feed in feeds:
    articles = list(request.app.database["articles"].find({
      "_id": {"$in": feed["article_ids"]},
      # "creation_time": {"$gt": time_ago}
    }).sort("creation_time", -1).skip(0).limit(50))
    
    out_articles = []
    for article in articles:
      am = packArticleWMeta(request, user_id, article)
      if not am.metadata.read:
        out_articles.append(am)
    

    final_articles[feed["_id"]] = out_articles

    # Insert sorting step
  
  return curate(final_articles)

@router.get("/user/{user_id}", summary='Get a users saved articles', status_code=status.HTTP_200_OK)
def pull(request: Request, user_id: str, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  querier_id = Authorize.get_jwt_subject()

  feeds = request.app.database["feeds"].find({
    "user_ids": user_id
  })
  
  final_articles = {}
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
    

    final_articles[feed["_id"]] = out_articles
  
  return final_articles

@router.get("/pull-all", summary='pull all public feeds', status_code=status.HTTP_200_OK)
def pull_all(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  feeds = list(request.app.database["feeds"].find({
    "name": {"$ne": "inbox"}
  }))

  feed_infos = []
  for feed in feeds:
    feed_infos.append({
      "_id": feed["_id"],
      "name": feed["name"],
    })
  return feed_infos

@router.post("/check-exists", summary='check if an feed exists', status_code=status.HTTP_200_OK)
def add_to_inbox(request: Request, exists_req: FeedExistsRequest = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  req = jsonable_encoder(exists_req)
  name = req["feed_name"]
  feed = request.app.database["feeds"].find_one({
    "name": name
  })
  if feed is None:
    return {"exists": False, "feed": {}}

  return {"exists": True, "feed": feed}

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
