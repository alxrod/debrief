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

load_dotenv()
openai.api_key = os.getenv("OPENAI_KEY")


class CustomSearchFeed(FeedObject):
    
    def __init__(self, id, query_content, query=""):
      super().__init__(id)

      # self.duck_client = Client()
      self.metaphor = Metaphor(os.getenv("METAPHOR_KEY"))

      self.query_content = query_content
      if query == None or query == "":
        self.query = self.generate_query(query_content)
      else:
        self.query = query
      
      
    
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
        print("Searching for ", self.query)
        # results = self.duck_client.search(self.query)
        # time.sleep(1)
        
        search_response = self.metaphor.search(
          self.query, use_autoprompt=True, start_published_date="2023-01-01"
        )

        links = [result.url for result in search_response.results]
        return links

     
    def fetch(self):
        return self.get_links()
    

