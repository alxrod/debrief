import boto3
import os

class Uploader():
  def __init__(self):
    self.s3 = boto3.resource("s3")

  def upload(self, temp_fname, bucket_key):
    uploaded = False
    try:
      sum_recording = open(temp_fname,"rb")
      self.s3.Bucket("debrief-summaries").put_object(Key=bucket_key, Body=sum_recording)
      os.remove(temp_fname)
      uploaded = True
    except:
      print("Failed to upload file to S3")
      uploaded = False


    return uploaded
    