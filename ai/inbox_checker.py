from redbox import EmailBox
import os
import time
import tiktoken

from dotenv import load_dotenv
from crawler import AudioGenerator

def parse_urls(text):
    """
    Parses URLs out from a body of text
    """
    import re
    urls = re.findall('(https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+\S+)', text)
    return urls

if __name__ == '__main__':
  load_dotenv()

  user = os.getenv("EMAIL_ADDRESS")
  password = os.getenv("EMAIL_PASSWORD")
  imap_url = 'imap.gmail.com'

  audio_gen = AudioGenerator()

  print("user: ", user, " password: ", password)
  # Create email box instance
  box = EmailBox(
      host=imap_url, 
      port=993,
      username=user,
      password=password
  )

  # Select an email folder
  inbox = box["INBOX"]

  whitelist = ["alexbrodriguez@gmail.com", "kwdaley@college.harvard.edu"]
  # Search and process messages
  while True:
    count = 0
    for msg in inbox.search(unseen=True):
      # Process the message
      for addr in whitelist:
        if addr in msg.from_:
          for url in parse_urls(msg.text_body):
            count += 1
            print("Generating summary for ", url)
            AudioGenerator.output_summary(audio_gen, url)

      # Set the message as read/seen
      msg.read()
    if count == 0:
      print("No new URLs saved")
    else:
      print("Saved ", count, " new URLs")
    time.sleep(5)
