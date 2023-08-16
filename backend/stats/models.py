import uuid;

import datetime
from typing import List, Optional, Dict
from pydantic import BaseModel, Field

class VisitModel(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  path: Optional[str]
  time: Optional[datetime.datetime]
  duration: Optional[int]
  button_activity: Optional[Dict[str, Dict[str, int]]]
  user_id: Optional[str]

class CreateVisitModel(BaseModel):
  path: Optional[str]
  duration: Optional[int]
  button_activity: Optional[Dict[str, Dict[str, int]]]
  user_id: Optional[str]

class Session(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  user_id: str
  article_ids: List[str]

  start_time: datetime.datetime
  end_time: datetime.datetime

  total_listens: int
  total_skip_forwards: int
  total_skip_backwards: int
  total_saves: int

class ArticleStat(BaseModel):
  user_id: str
  article_id: int

  listens: int
  skip_forwards: int
  skip_backwards: int

  average_skip_perc: float


class SessionEvent(BaseModel):
  
  user_id: str
  article_id: str

# As time stamps
  session_start_time: int
  event_time: int

  event_type: str
  percent_complete: Optional[float]

  @staticmethod
  def eventTypes():
    return [
      "complete",
      "skipForward",
      "skipBackward",
    ]

  

