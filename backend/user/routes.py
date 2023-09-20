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

    feed_metas.append(snip)
  
  del user['password']

  return {
    "user": user,
    "feeds": feed_metas
  }

# @router.post("/", response_description='create a todo list', status_code=status.HTTP_201_CREATED,response_model=ListModel)
# def create_list(request: Request, list: ListModel = Body(...)):
#   list = jsonable_encoder(list)
#   new_list_item = request.app.database["lists"].insert_one(list)
#   created_list_item = request.app.database["lists"].find_one({
#     "_id": new_list_item.inserted_id
#   })

#   return created_list_item

# @router.get("/", response_description="list all the todos", response_model=List[ListModel])
# def show_list(request: Request):
#     todos = list(request.app.database["lists"].find(limit=50))
#     return todos

# @router.delete("/",response_description="delete a item from list")
# def delete_list(id: str, request: Request, response: Response):
#     delete_result = request.app.database["lists"].delete_one({"_id": id})

#     if delete_result.deleted_count == 1:
#         response.status_code = status.HTTP_204_NO_CONTENT
#         return response
#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail = "Item with {id} not found")

# @router.put("/",response_description="update the item in list", response_model=ListModel)
# def update_item(id: str, request: Request, list: ListUpdateModel = Body(...)):
#     listItems = {}
#     for k,v in list.dict().items():
#       if v is not None:
#         listItems = {k:v}

#     print(listItems)
#     # if list.title | list.description:
#     update_result = request.app.database["lists"].update_one({"_id": id }, {"$set": listItems })
#     # print("update result ",update_result.modified_count)

#     if update_result.modified_count == 0:
#       raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED, detail=f"Item with ID {id} has not been modified")


#     if (
#       updated_list_item := request.app.database["lists"].find_one({"_id": id})
#     ) is not None:
#       return updated_list_item

#     raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"ListItem with ID {id} not found")
