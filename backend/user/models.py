import uuid;

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

class UserModel(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  email: str
  password: str
  creation_time: Optional[datetime]
  playback_speed: Optional[float] = Field(default=1.0)

class TokenSchema(BaseModel):
  access_token: str
  refresh_token: str

class TokenPayload(BaseModel):
  sub: str = None
  exp: int = None

class RefreshRequest(BaseModel):
  refresh_token: str

class UserOut(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  email: str

class PlaybackSpeedChange(BaseModel):
  playback_speed: float

class SystemUser(UserOut):
  password: str