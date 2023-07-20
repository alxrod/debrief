from fastapi import APIRouter, Body, Request, Response, HTTPException, status,  Depends
from fastapi.encoders import jsonable_encoder
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from fastapi.security.api_key import APIKey
import user.auth as auth

from typing import List
import datetime

from uuid import uuid4

from user.models import UserModel
from feed.models import FeedModel
from article.models import ArticleModel, ArticleMetaModel, InboxAddRequest

router = APIRouter()

# User Routes needed:
# 1) Sign up
# 2) Log in
# 3) Pull
def create_article(request: Request, article):
  existing_site = request.app.database["articles"].find_one({
    "raw_link": article["raw_link"]
  })
  if existing_site is not None:
    return existing_site
  article["creation_time"] = datetime.datetime.now()

  new_article = request.app.database["articles"].insert_one(article)
  created_site = request.app.database["articles"].find_one({
    "_id": new_article.inserted_id
  })
  return created_site


@router.post("/create", summary='create a new article', status_code=status.HTTP_201_CREATED,response_model=ArticleModel)
def create(request: Request, article: ArticleModel = Body(...), Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()
  new_article = jsonable_encoder(article)
  created_site = create_article(request, new_article)
  return created_site

@router.post("/add-to-inbox", summary='add new article to users inbox', status_code=status.HTTP_201_CREATED)
def add_to_inbox(request: Request, inbox_req: InboxAddRequest = Body(...), api_key: APIKey = Depends(auth.get_api_key)):
  print("REQ BEGAN")
  article_and_user = jsonable_encoder(inbox_req)
  created_site = create_article(request, article_and_user["article"])

  user = request.app.database["users"].find_one({
    "email": article_and_user["email"]
  })
  if user is None:
    print("BROKEN")
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="There is no registered user with this email"
    )
  
  feed = request.app.database["feeds"].find_one({
    "name": "inbox",
    "user_ids": user["_id"]
  })

  if feed is None:
    print("INBOX NEEDS TO BE CREATED")
    inserted_new_feed = request.app.database["feeds"].insert_one(FeedModel.emptyFeed("inbox"))
    feed = request.app.database["feeds"].find_one({
        "_id": inserted_new_feed.inserted_id
    })

    feed["user_ids"] = [user["_id"]]
    feed["article_ids"] = [created_site["_id"]]
  else:
    if created_site["_id"] in feed["article_ids"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="The article you added is already in the feed")
    feed["article_ids"].append(created_site["_id"])
    feed["user_ids"].append(user["_id"])
  
  update_result = request.app.database["feeds"].update_one({"_id": feed["_id"] }, {"$set": {
    "user_ids": feed["user_ids"],
    "article_ids": feed["article_ids"],
  }})
  if update_result.modified_count == 0:
    raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=f"Feed has not been modified")
    
  return created_site
