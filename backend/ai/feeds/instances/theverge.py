import requests
import os
from bs4 import BeautifulSoup, SoupStrainer

from ai.feeds.feed_object import FeedObject
import time

class TheVergeFeed(FeedObject):
    def __init__(self, feed_id=""):
        super().__init__(feed_id)
        self.root_url = "https://www.theverge.com/"
    
    def remove_duplicates(self, arr):
        return list(set(arr))

    def is_number(self, s):
        try:
            int(s)
            return True
        except ValueError:
            return False

    def get_links(self):
        retry = True    
        while retry:
            try:
                res = requests.get(self.root_url)
                retry = False
            except:
                time.sleep(0.020)

        soup = BeautifulSoup(res.content, 'html.parser')
        links = [a['href'] for a in soup.find_all('a', href=True) if a['href'].split("/")[0] == ""]
        links = list(set(links))
        links = [(self.root_url+link) for link in links if self.is_number(link.split("/")[1])]
        return links
     
    def fetch(self):
        return self.get_links()[:10]
    

