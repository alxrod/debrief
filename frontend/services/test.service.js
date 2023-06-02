import { TestClient } from "../proto/test_grpc_web_pb";
import { 
  PingRequest,
 } from "../proto/test_pb";

export const testClient = new TestClient(process.env.NEXT_PUBLIC_API_URL);

class TestService {

  ping() {
      var req = new PingRequest();   
      return new Promise( (resolve, reject) => { 
          testClient.ping(req, null, function(error, response) {
              if (error) {
                  reject(error.message)
                  return 
              }
              var resp = response.toObject();
              resolve(resp.message)
          });
      });
  }   
}

export default new TestService();