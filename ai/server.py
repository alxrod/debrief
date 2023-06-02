from concurrent import futures
import logging

import grpc
import debrief_proto.website_pb2
import debrief_proto.website_pb2_grpc

from audio_generator import AudioGenerator

class Generator(debrief_proto.website_pb2_grpc.GenerateServicer):
    def __init__(self):
        super().__init__()
        self.audio_gen = AudioGenerator()

    def Summarize(self, request, context):
        link = request.raw_link
        print("Generating for link ", link)
        self.audio_gen.output_summary(link)
        print("generation complete")
        return request


def serve():
    port = '50051'
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    debrief_proto.website_pb2_grpc.add_GenerateServicer_to_server(Generator(), server)
    server.add_insecure_port('[::]:' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ == '__main__':
    logging.basicConfig()
    serve()
