import requests
import os
from bs4 import BeautifulSoup, SoupStrainer

from ai.feeds.feed_object import FeedObject
import time

from dotenv import load_dotenv
from metaphor_python import Metaphor
from duckpy import Client

from datetime import datetime

import openai

import math

load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")

MAX_COUNT_DAY = 3

class CustomSearchFeed(FeedObject):
    
    def __init__(self, id, query_content, query=""):
      super().__init__(id)

      # self.duck_client = Client()
      self.metaphor = Metaphor(os.getenv("METAPHOR_KEY"))

      self.query_content = query_content
      if query == None or query == "":
        # self.query = 
        self.query = self.query_content
      else:
        self.query = query

      #  THIS IS A MAJOR STOP GAP I SHOUDL REMOVE THIS LATER BUT JUST AS A BACKUP
      self.query_count = 0
      self.count_init = datetime.now()    
    
    def generate_query(self, query_content):
      prompt = (f"Generate a google search query that gets the latest news and updates on the following subject: \n{query_content}")
      messages = []
      messages.append({"role": "user", "content": prompt})
      response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        temperature=0.5,
        messages=messages,
      )
      search = (response["choices"][0]["message"]["content"])
      search = search.replace('"', '')
      search = search.replace("'", '')
      return search

    def get_links(self):
        
        # results = self.duck_client.search(self.query)
        # time.sleep(1)
        
        days_since_init = math.ceil((datetime.now() - self.count_init).total_seconds() / 86400)


        # For cost recents capped at one a day
        if (self.query_count / days_since_init) <= MAX_COUNT_DAY:
          print("Metaphor request for ", self.query)
          search_response = self.metaphor.search(
            self.query, use_autoprompt=True, start_published_date="2023-01-01"
          )
          self.query_count += 1

          contents_response = search_response.get_contents()

          links = [content.url for content in contents_response.contents]
            
        else:
          print("Query ", self.query," has exceeded its daily limit")
          links = []


        return links

     
    def fetch(self):
        return self.get_links()
    

