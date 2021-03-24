import {izi_api_client_id} from "../../config/iziConfig"
import {getUniqueId} from 'react-native-device-info'


const server_url = "http://192.168.13.205:96/iziflo_1.5.2_maintenance_cfao/"
const ws_index = "mobile_ws/core/"+core_version+"/index.php"

const core_version = '0.0.1.0'

export function requestInstances(email, password){
  const url = server_url + ws_index  
        + "?module_name=core"
        + "&module_version="+core_version
        + "&module_api=get_instances"
        + "&email="+email
        + "&password="+password
        + "&client_id="+ izi_api_client_id
        + "&device_id="+_getDeviceId()
        console.log(url);
  return fetch(url)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}
export function requestInstancesWithExternal(clientId, email, token, tokenType){
}

//request token
export function requestToken( email, password, idInstance){
  const url = server_url + ws_index  
        + "?module_name=core"
        + "&module_version="+core_version
        + "&module_api=request_token"
        + "&email="+email
        + "&password="+password
        + "&id_instance="+ idInstance
        + "&client_id="+ izi_api_client_id
        + "&device_id="+getUniqueId()
        console.log(url);
  return fetch(url)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

export function requestTokenWithExternal(clientId, email, token, tokenType, idInstance){

}

