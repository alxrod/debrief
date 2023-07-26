import uuid

from dotenv import dotenv_values
from ai.audio_generator import AudioGenerator
from ai.uploader import Uploader
from ai.feeds.audio_poster import AudioPoster

from email_listener.listener import read_email_from_gmail
import requests
import time

from ai.main_generator import MainGenerator

if __name__ == "__main__":
  config = dotenv_values(".env")

  mg = MainGenerator()
  # print(poster.base_url + "/article/add-to-inbox")

  
  while True:
    print("Checking for new emails...")
    mail_bodies = read_email_from_gmail(config["EMAIL"], config["EMAIL_PWORD"])
    print("Found emails: ", len(mail_bodies))
    
    for email, url_set in mail_bodies.items():
      for url in url_set:
        print("Ingesting ", url)
        mg.ingest(url, email=email)
        print("...done")
    time.sleep(5)

      