from concurrent import futures
import logging

import grpc
import sys
import os 
sys.path.insert(1, os.getcwd()+'/debrief_proto')


from debrief_proto import generic_pb2
from debrief_proto import website_pb2
from debrief_proto import website_pb2_grpc
import boto3

import os
from audio_generator import AudioGenerator

class Generator(website_pb2_grpc.GenerateServicer):

    def __init__(self):
        super().__init__()
        self.audio_gen = AudioGenerator()
        self.s3 = boto3.resource("s3")

    def Title(self, request, context):
        link = request.raw_link
        print("Titling link ", link)
        title  = self.audio_gen.output_title(link)

        request.title = title
        request.summary = ""
        request.summary_uploaded = False

        return request
    

    def Summarize(self, request, context):
        link = request.raw_link
        print("Generating summary for link ", link)

        # summary = ""
        title, summary, temp_file = self.audio_gen.output_summary(link)
        uploaded = False

        try:
            sum_recording = open(temp_file,"rb")
            self.s3.Bucket("debrief-summaries").put_object(Key=request.id+".mp3", Body=sum_recording)
            uploaded = True

        except:
            uploaded = False

        os.remove(temp_file)

        request.title = title
        request.summary = summary
        request.summary_uploaded = uploaded
        
        print("generation complete")
        return request
    
    def TestConn(self, request, context):
        return generic_pb2.NullResponse()

def serve():
    port = '50051'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    website_pb2_grpc.add_GenerateServicer_to_server(Generator(), server)
    server.add_insecure_port('[::]:' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()

