import requests
import os
from bs4 import BeautifulSoup, SoupStrainer
from datetime import datetime
from ai.feeds.feed_object import FeedObject
import time

class TheGuardianFeed(FeedObject):
    def __init__(self, feed_id=""):
        super().__init__(feed_id)
        self.root_url = "https://www.theguardian.com/us"
    
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
        links = [a['href'] for a in soup.find_all('a', href=True) if a['href'].split("/")[0] == "" and len(a['href'].split("/")) > 3]
        current_year = str(datetime.now().year)
        links = [link for link in links if current_year in link.split("/")]
        # Remove cateogries I personally dont care about
        links = [link for link in links if link.split("/")[1] in ['business', 'politics', 'news', 'us-news']]
        # links = [link for link in links if "food" not in link.split("/")]
        # links = [link for link in links if "film" not in link.split("/")]
        # links = [link for link in links if "lifeandstyle" not in link.split("/")]
        # links = [link for link in links if "society" not in link.split("/")]
        # links = [link for link in links if "football" not in link.split("/")]
        # links = [link for link in links if "artanddesign" not in link.split("/")]
        # links = [link for link in links if "commentisfree" not in link.split("/")]
        # links = [link for link in links if "tv-and-radio" not in link.split("/")]
        
        links = list(set(links))
        # links = [(self.root_url+link) for link in links if self.is_number(link.split("/")[1])]
        links = [("https://www.theguardian.com"+link) for link in links]
        return links[:10]
     
    def fetch(self):
        return self.get_links()
    

