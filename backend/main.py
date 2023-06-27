from fastapi import FastAPI, Depends, Request, HTTPException
from dotenv import dotenv_values
from pymongo import MongoClient
from pydantic import BaseModel

from user.routes import router as user_router
from article.routes import router as article_router
from feed.routes import router as feed_router
from metadata.routes import router as metadata_router

from fastapi.responses import JSONResponse
from fastapi_jwt_auth import AuthJWT
from fastapi_jwt_auth.exceptions import AuthJWTException

config = dotenv_values(".env")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, tags=["user"], prefix="/user")
app.include_router(article_router, tags=["article"], prefix="/article")
app.include_router(feed_router, tags=["feed"], prefix="/feed")
app.include_router(metadata_router, tags=["metadata"], prefix="/metadata")

@app.get("/")
async def root():
    return {"message": "API using Fast API and pymongo"}

@app.on_event("startup")
def startup_db_client():
    # app.mongodb_client = MongoClient(config["MONGODB_CONNECTION_URI"])
    # app.database = app.mongodb_client[config["DB_NAME"]]
    app.mongodb_client = MongoClient("mongodb://127.0.0.1:27017")
    app.database = app.mongodb_client["todo_backend"]
    print("Connected to the MongoDB database!")

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()

class Settings(BaseModel):
    authjwt_secret_key: str = "secret"

@AuthJWT.load_config
def get_config():
    return Settings()

@app.exception_handler(AuthJWTException)
def authjwt_exception_handler(request: Request, exc: AuthJWTException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )