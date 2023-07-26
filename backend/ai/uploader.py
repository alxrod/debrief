import boto3
import os
import datetime
import json 

class Uploader():
  def __init__(self):
    self.s3 = boto3.resource("s3")
  
  def url_to_bucket_key(self, url):
    return "v1/" + ''.join(c for c in url if c.isalnum())+"/" + "audio.mp3",  "v1/" + ''.join(c for c in url if c.isalnum())+"/" + "metadata.json"

  def upload(self, temp_fname, article):
    audio_key, metadata_key = self.url_to_bucket_key(article["raw_link"])
    article["upload_path"] = audio_key

    metadata_path = "tmp/metadata.json"

    self.s3.Bucket("debrief-summaries").put_object(
      Key=metadata_key, 
      Body=(bytes(json.dumps(article).encode('UTF-8')))
    )

    sum_recording = open(temp_fname,"rb")
    self.s3.Bucket("debrief-summaries").put_object(Key=audio_key, Body=sum_recording)
    os.remove(temp_fname)

    return article, True
  
  def check_bucket(self, url):
    audio_key, metadata_key = self.url_to_bucket_key(url)
    try:
      obj = self.s3.Object("debrief-summaries", metadata_key).get()
      file_content = obj.get('Body').read().decode('utf-8')
      json_content = json.loads(file_content)
      return True, json_content

    except:
      return False, {}