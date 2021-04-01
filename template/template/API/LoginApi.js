import {izi_api_client_id,izi_api_app_code} from "../../config/iziConfig"
import {getUniqueId} from 'react-native-device-info'
import Config from "react-native-config";


const core_version = '0.0.1.0'
const server_url = "http://192.168.13.205:96/iziflo_1.5.2_maintenance_cfao/"
const ws_index = "/mobile_ws/core/"+core_version+"/index.php"


export const ProdServer={
  name:"Production",
  code:'PROD',
  url:'https://cfao.iziflo.com',
  id:0
}

export function requestInstances(server, email, password){
  const url = server.url + ws_index  
        + "?module_name=core"
        + "&module_version="+core_version
        + "&module_api=get_instances"
        + "&email="+email
        + "&password="+password
        + "&client_id="+ izi_api_client_id
        + "&device_id="+getUniqueId()
        console.log(url);
  return fetch(url)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

export function requestInstancesWithExternal(server, clientId, email, token, tokenType){
}

//request token
export function requestToken( server, email, password, idInstance){
  const url = server.url + ws_index  
        + "?module_name=core"
        + "&module_version="+core_version
        + "&module_api=request_token"
        + "&email="+email
        + "&password="+password
        + "&id_instance="+ idInstance
        + "&client_id="+ izi_api_client_id
        + "&device_id="+getUniqueId()
  return fetch(url)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

//check token
export function checkToken( server, email, password, idInstance, token){
  const url = server.url + ws_index  
        + "?module_name=core"
        + "&module_version="+core_version
        + "&module_api=check_token"
        + "&id_instance="+ idInstance
        + "&token="+ token
        + "&client_id="+ izi_api_client_id
        + "&device_id="+getUniqueId()
  return fetch(url)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

export function requestTokenWithExternal(server, clientId, email, token, tokenType, idInstance){

}

export function searchServers(email){
  const url = Config.DEV_SERVER+"/ws/get_izi_app.php"
        + "?email="+email
        + "&app_code="+ izi_api_app_code
        + "&app_type="+Config.FLAVOR
        + "&core_version="+core_version
        return fetch(url)
          .then((response) => {
              return response.json()
          })
          .catch((error) => console.error(error))
}

