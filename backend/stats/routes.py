from fastapi import APIRouter, Body, Request, Response, HTTPException, status,  Depends
from fastapi.encoders import jsonable_encoder

from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

from typing import List


from uuid import uuid4

from stats.models import CreateVisitModel, VisitModel, SessionEvent, ArticleStat, Session

import datetime

router = APIRouter()

@router.post("/visit/create", summary='creating visit stat', status_code=status.HTTP_201_CREATED)
def visit_add(request: Request, visit_body: CreateVisitModel = Body(...)):
  print("Saving visit")
  created_visit = jsonable_encoder(visit_body)
  visit = VisitModel(**created_visit)
  visit.time = datetime.datetime.now()
  new_visit = request.app.database["visits"].insert_one(jsonable_encoder(visit))

@router.post("/session/add-event", summary='add event to session', status_code=status.HTTP_201_CREATED)
def event_add(request: Request, event: SessionEvent = Body(...)):
  created_event = jsonable_encoder(event)
  
  # Look for session object, update those stats
  session_time = datetime.datetime.fromtimestamp(created_event["session_start_time"] / 1e3)
  event_time = datetime.datetime.fromtimestamp(created_event["event_time"] / 1e3)

  session = request.app.database["sessions"].find_one({
    "user_id": created_event["user_id"],
    "start_time": session_time,
  })

  # If we have no metadata on article when we fetch, generate it now
  if session is None:
    new_session = {
      "user_id": created_event["user_id"],
      "article_ids": [created_event["article_id"]],
      "start_time": session_time,
      "end_time": session_time,
      "total_listens": 0,
      "total_skip_forwards": 0,
      "total_skip_backwards": 0,

    }
    if created_event["event_type"] == "complete":
      new_session["total_listens"] += 1
    elif created_event["event_type"] == "skipForward":
      new_session["total_skip_forwards"] += 1
    elif created_event["event_type"] == "skipBackward":
      new_session["total_skip_backwards"] += 1

    request.app.database["sessions"].insert_one(new_session)

  else:
    session["end_time"] = event_time
    if created_event["article_id"] not in session["article_ids"]:
      session["article_ids"].append(created_event["article_id"])

    if created_event["event_type"] == "complete":
      session["total_listens"] += 1
    elif created_event["event_type"] == "skipForward":
      session["total_skip_forwards"] += 1
    elif created_event["event_type"] == "skipBackward":
      session["total_skip_backwards"] += 1
    
    request.app.database["sessions"].update_one({"_id": session["_id"]}, {"$set": session})


  # Update article stats
  article_stat = request.app.database["article_stats"].find_one({
    "user_id": created_event["user_id"],
    "article_id": created_event["article_id"],
  })

  if article_stat is None:
    new_article_stat = {
      "user_id": created_event["user_id"],
      "article_id": created_event["article_id"],
      "listens": 0,
      "skip_forwards": 0,
      "skip_backwards": 0,
    }
    if created_event["event_type"] == "complete":
      new_article_stat["listens"] += 1
    elif created_event["event_type"] == "skipForward":
      new_article_stat["average_skip_perc"] = created_event["percent_complete"]
      new_article_stat["skip_forwards"] += 1

    elif created_event["event_type"] == "skipBackward":
      new_article_stat["skip_backwards"] += 1

    request.app.database["article_stats"].insert_one(new_article_stat)
    
  else:
    if created_event["event_type"] == "complete":
      article_stat["listens"] += 1
    elif created_event["event_type"] == "skipForward":
      
      average_skip_perc = (article_stat["average_skip_perc"] * article_stat["skip_forwards"] +
        created_event["percent_complete"]) / article_stat["skip_forwards"] + 1
      
      article_stat["average_skip_perc"] = average_skip_perc
      article_stat["skip_forwards"] += 1

    elif created_event["event_type"] == "skipBackward":
      article_stat["skip_backwards"] += 1

    request.app.database["article_stats"].update_one({"_id": article_stat["_id"]}, {"$set": article_stat})