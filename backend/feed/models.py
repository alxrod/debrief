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

  last_updated: Optional[datetime.datetime] = Field(default=datetime.datetime.now() - datetime.timedelta(days=365))
  dormant: Optional[bool] = Field(default_factory=False)

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

class InterestFeedModel(FeedModel):
  interest_feed: bool = Field(default_factory=False)
  author_id: str
  query_content: str
  query: str

  @staticmethod
  def emptyFeed(feed_name, query_content, unique_name, user_id=""):
    obj = {
      "_id": str(uuid.uuid4()),
      "name": feed_name,
      "author_id": "",
      "user_ids": [],
      "article_ids": [],
      "creation_time": datetime.datetime.now(),
      "save_time": datetime.datetime.now(),
      "interest_feed": True,
      "query_content": query_content,
      "query": "",
      "unique_name": unique_name,
      "last_updated": datetime.datetime.now() - datetime.timedelta(days=365),
      "dormant": False
      
    }

    if user_id != "":
      obj["user_ids"].append(user_id)
    
    return obj

class FeedCreateScheme(BaseModel):
  feed_name: str

  # last_pull: Optional[datetime.datetime]

class InterestFeedCreateScheme(BaseModel):
  query_content: str

class InterestFeedJoinScheme(BaseModel):
  unique_name: str


class FeedUpdateScheme(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")  

class InterestFeedUpdateScheme(FeedUpdateScheme):
  query: Optional[str]
  query_content: Optional[str]
  unique_name: Optional[str]

class FeedExistsRequest(BaseModel):
  feed_name: str
  
class FeedRequestScheme(BaseModel):
  feed_id: str

class FeedAddScheme(BaseModel):
  feed_id: str
  type: str
  addition_id: str


  
