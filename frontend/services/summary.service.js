import { SummaryClient } from "../debrief_proto/website_grpc_web_pb";
import { 
  WebsiteByUserQuery,
  FlagRequest,
 } from "../debrief_proto/website_pb";

export const summaryClient = new SummaryClient(process.env.NEXT_PUBLIC_API_URL);



class SummaryService {

  get(token, user_id) {
    let queryRequest = new WebsiteByUserQuery();
    queryRequest.setUserId(user_id);

    return new Promise( (resolve, reject) => { 
      var metadata = {"authorization": token}
      summaryClient.get(queryRequest, metadata, function(error, response) {
        if (error) {
            reject(error.message)
            return 
        }
        const sites = response.getWebsitesList()
        const sites_list = []
        for (let i = 0; i < sites.length; i++) {
          sites_list.push(sites[i].toObject())
          sites_list[i].read = sites[i].getUserInfosMap().get(user_id).getRead()
          sites_list[i].archived = sites[i].getUserInfosMap().get(user_id).getArchived()
          sites_list[i].saved = sites[i].getUserInfosMap().get(user_id).getSaved()
          sites_list[i].saveTime = sites[i].getUserInfosMap().get(user_id).getSaveTime().toDate()
        }
        resolve(sites_list)
      });
    }); 
  }   

  toggleFlag(token, user_id, website_id, flag_name, flag_status) {
    let req = new FlagRequest();
    req.setWebsiteId(website_id);
    req.setFlagName(flag_name);
    req.setFlagStatus(flag_status);
    req.setUserId(user_id);

    return new Promise( (resolve, reject) => { 
      var metadata = {"authorization": token}
      summaryClient.toggleFlag(req, metadata, function(error, response) {
        if (error) {
          reject(error.message)
          return 
        }
        resolve()
      });
    });
  }   
}

const parseUserInfoMap = (infos) => {
  var userInfos = new Map();
  infos.forEach(function(v, k) {
    userInfos.set(k, {
      saveTime: v.getSaveTime().toDate(),
      read: v.getRead(),
    })
  });
  return userInfos;
}

export default new SummaryService();