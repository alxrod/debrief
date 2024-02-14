from fastapi import APIRouter, Body, Request, Response, HTTPException, status,  Depends
from fastapi.encoders import jsonable_encoder
from fastapi.responses import RedirectResponse

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from typing import List
import datetime


from user.utils import get_hashed_password

from uuid import uuid4

from user.models import UserModel,TokenSchema, PlaybackSpeedChange

from user.utils import (
    get_hashed_password,
    create_access_token,
    create_refresh_token,
    verify_password
)

router = APIRouter()

# User Routes needed:
# 1) Sign up
# 2) Log in
# 3) Pull

@router.post("/register", summary='register a new user', status_code=status.HTTP_201_CREATED)
def register(request: Request, user: UserModel = Body(...), Authorize: AuthJWT = Depends()):
  new_user = jsonable_encoder(user)
  existing_user = request.app.database["users"].find_one({
    "email": new_user["email"]
  })
  if existing_user is not None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="User with this email already exist"
    )
  new_user["creation_time"] = datetime.datetime.now()
  new_user["password"] = get_hashed_password(new_user["password"])
  new_user["playback_speed"] = 1.0

  new_user = request.app.database["users"].insert_one(new_user)
  created_user = request.app.database["users"].find_one({
    "_id": new_user.inserted_id,
  })
  
  access_token = Authorize.create_access_token(subject=created_user["_id"])
  refresh_token = Authorize.create_refresh_token(subject=created_user["_id"])
  return {"access_token": access_token, "refresh_token": refresh_token}

@router.post('/login', summary="login a user", response_model=TokenSchema)
def login(request: Request, user_data: UserModel = Body(...), Authorize: AuthJWT = Depends()):
  user = request.app.database["users"].find_one({
    "email": user_data.email,
  })
  if user is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Incorrect email or password"
    )
  
  hashed_pass = user['password']

  if not verify_password(user_data.password, hashed_pass):
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Incorrect email or password"
    )
  
  access_token = Authorize.create_access_token(subject=user["_id"])
  refresh_token = Authorize.create_refresh_token(subject=user["_id"])
  return {"access_token": access_token, "refresh_token": refresh_token}

@router.post('/refresh')
def refresh(Authorize: AuthJWT = Depends()):
    Authorize.jwt_refresh_token_required()

    user_id = Authorize.get_jwt_subject()
    new_access_token = Authorize.create_access_token(subject=user_id)
    return {"access_token": new_access_token}

@router.post('/change-playback')
def changePlayback(request: Request, speed_req: PlaybackSpeedChange = Body(...), Authorize: AuthJWT = Depends()):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
  
    user = request.app.database["users"].find_one({
      "_id": user_id
    })

    if user is None:
      raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="No user"
      )
  
    user["playback_speed"] = speed_req.playback_speed

    request.app.database["users"].update_one({"_id": user_id}, {"$set": user})

    return "success"

@router.get('/cur', summary='get details of currently logged in user')
def get_me(request: Request, Authorize: AuthJWT = Depends()):
  Authorize.jwt_required()

  user_id = Authorize.get_jwt_subject()
  user = request.app.database["users"].find_one({
    "_id": user_id
  })
  if user is None:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="The provided token is invalid"
    )
  feeds = request.app.database["feeds"].find({
    "user_ids": user_id
  })

  feed_metas = []
  for feed in feeds:
    snip = {
      "id": feed["_id"],
      "name": feed["name"]
    } 
    if "interest_feed" in feed and feed["interest_feed"]:
      snip["interest_feed"] = True
      snip["query_content"] = feed["query_content"]
      snip["unique_name"] = feed["unique_name"]
      snip["author_id"] = feed["author_id"]
      snip["private"] = feed["private"]

    feed_metas.append(snip)
  
  del user['password']

  return {
    "user": user,
    "feeds": feed_metas
  }