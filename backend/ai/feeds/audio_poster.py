import requests

class AudioPoster:
  def __init__(self, access_token, site_base):
    self.token = access_token
    self.base_url = site_base

  def check_article_exists(self, article_link, feed_id=""):
    url = self.base_url + "/article/check-exists"
    head = {'access_token': self.token}
    params = {
      "article_link": article_link
    }
    if feed_id != "":
      params["feed_id"] = feed_id

    resp = requests.post(url, json=params, headers=head)
    if resp.status_code == 200:
      body = resp.json()
      if "exists" in body:
        return body["exists"]
    return False


  def post_audio(self, email, article):
    url = self.base_url + "/article/add-to-inbox"
    head = {'access_token': self.token}
    requests.post(url, json={
      "email": email,
      "article": article
    }, headers=head)
  
  def save_new_article(self, feed_id, article):
    url = self.base_url + "/article/add-to-feed"
    head = {'access_token': self.token}
    requests.post(url, json={
      "feed_id": feed_id,
      "article": article
    }, headers=head)