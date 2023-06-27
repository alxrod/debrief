import uuid

from dotenv import dotenv_values
from ai.audio_generator import AudioGenerator
from ai.uploader import Uploader
from email_listener.listener import read_email_from_gmail
import requests
import time

class AudioPoster:
  def __init__(self, access_token, site_base):
    self.token = access_token
    self.base_url = site_base

  def post_audio(self, email, article):
    url = self.base_url + "/article/add-to-inbox"
    head = {'access_token': self.token}
    requests.post(url, json={
      "email": email,
      "article": article
    }, headers=head)


if __name__ == "__main__":
  config = dotenv_values(".env")

  ag = AudioGenerator()
  uploader = Uploader()
  poster = AudioPoster(config["API_KEY"], config["API_URL"])
  # print(poster.base_url + "/article/add-to-inbox")

  while True:
    print("Checking for new emails...")
    mail_bodies = read_email_from_gmail(config["EMAIL"], config["EMAIL_PWORD"])
    print("Found emails: ", len(mail_bodies))
    
    for email, url_set in mail_bodies.items():
      for url in url_set:
        html = ag.get_html(url)
        title, summary, output_name = ag.output_summary(url)

        key = config["BUCKET_DIR"]+"/"+str(uuid.uuid4())+".mp3"

        uploaded = uploader.upload(output_name, key)

        article = {
          "raw_link": url,
          "title": title,
          "summary": summary,
          "summary_uploaded": uploaded,
          "upload_path": key,
        }

        print("Uploading article: ", article)
        poster.post_audio(email, article)
        print("...done")
    time.sleep(5)

      