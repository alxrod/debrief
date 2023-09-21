import requests
from ai.feeds.instances.customsearch import CustomSearchFeed
from dateutil.parser import parse

class InterestManager:
    
    def __init__(self, token, base_url):
      self.base_url = base_url
      self.token = token
    
    def get_interest_jsons(self):
      url = self.base_url + "/feed/pull-all-interests"
      head = {'access_token': self.token}
      resp = requests.get(url, json={}, headers=head)

      if resp.status_code == 200:
        body = resp.json()
        if "interests" in body:
          return body["interests"]
        
      return []
  
    def update_interest_query(self, interest):
      url = self.base_url + "/feed/server-update-interest/"+interest.feed_id
      head = {'access_token': self.token}
      requests.post(url, json={
        "_id": interest.feed_id,
        "query": interest.query
      }, headers=head)
    
    def ingest_interests(self, interest_jsons):
      interest_feeds = []
      for interest_json in interest_jsons:
        interest = CustomSearchFeed(interest_json["_id"], interest_json["query_content"], interest_json["query"])
        interest.last_updated = parse(interest_json["last_updated"])
        
        print("Adding ", interest.query_content, " to interest feeds")
        if interest.query != interest_json["query"]:
          self.update_interest_query(interest)

        # TAKE OUT FOR PROD
        # if len(interest_json["article_ids"]) == 0:
        interest_feeds.append(interest)
      
      return interest_feeds

    def get_feeds(self):
      jsons = self.get_interest_jsons()
      self.interest_feeds = self.ingest_interests(jsons)
      return self.interest_feeds
  
    def get_new_feeds(self):
      jsons = self.get_interest_jsons()
      new_jsons = [json for json in jsons if json["_id"] not in [feed.feed_id for feed in self.interest_feeds]]
      new_feeds = self.ingest_interests(new_jsons)
      self.interest_feeds += new_feeds
      return new_feeds
