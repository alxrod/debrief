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
from metadata.models import MetadataUpdate

router = APIRouter()

@router.post("/update", summary='update article metadata', status_code=status.HTTP_200_OK)
def add_to_inbox(request: Request, update: MetadataUpdate = Body(...), Authorize: AuthJWT = Depends()):
  new_tags = jsonable_encoder(update)
  Authorize.jwt_required()
  user_id = Authorize.get_jwt_subject()

  metadata = request.app.database["metadata"].find_one({
    "_id": new_tags["id"]
  })

  print("META: ", metadata)
  if user_id != metadata["user_id"]:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="You do not have access to this metadata"
    )
  for key, value in new_tags.items():
    if key != "id":
      metadata[key] = value
  
  request.app.database["metadata"].update_one({"_id": new_tags["id"]}, {"$set": metadata})
  return metadata