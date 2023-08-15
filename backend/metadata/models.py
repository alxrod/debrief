import uuid;

import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class MetadataModel(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  user_id: str
  article_id: str
  read: bool
  archived: bool
  saved: bool
  save_time: Optional[datetime.datetime]

  @staticmethod
  def emptyMetaData(article_id: str, user_id: str):
    return {
      "_id": str(uuid.uuid4()),
      "user_id": user_id,
      "article_id": article_id,
      "read": False,
      "archived": False,
      "saved": False,
      "save_time": datetime.datetime.now()
    }

class MetadataUpdate(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  read: Optional[bool]
  archived: Optional[bool]
  saved: Optional[bool]