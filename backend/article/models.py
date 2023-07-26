import uuid;

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field
from metadata.models import MetadataModel

class ArticleModel(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  raw_link: str
  title: Optional[str]
  summary: Optional[str]
  summary_uploaded: Optional[bool]
  upload_path: Optional[str]
  creation_time: Optional[datetime]

class ArticleMetaModel(ArticleModel):
  metadata: MetadataModel

class InboxAddRequest(BaseModel):
  email: str
  article: ArticleModel

class FeedAddRequest(BaseModel):
  feed_id: str
  article: ArticleModel

class ArticleExistsRequest(BaseModel):
  article_link: str
  feed_id: Optional[str]