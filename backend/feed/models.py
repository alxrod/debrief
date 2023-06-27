import uuid;

import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class FeedModel(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  name: str
  user_ids: List[str]
  article_ids: List[str]
  creation_time: Optional[datetime.datetime]
  last_added: Optional[datetime.datetime]

  @staticmethod
  def emptyFeed(feed_name):
    return {
      "_id": str(uuid.uuid4()),
      "name": feed_name,
      "user_ids": [],
      "article_ids": [],
      "creation_time": datetime.datetime.now(),
      "save_time": datetime.datetime.now()
    }

class FeedCreateScheme(BaseModel):
  feed_name: str
  
class FeedRequestScheme(BaseModel):
  feed_id: str

class FeedAddScheme(BaseModel):
  feed_id: str
  type: str
  addition_id: str