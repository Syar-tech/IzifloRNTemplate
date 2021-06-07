
import {izi_api_app_code,izi_api_app_api_version} from "../../config/iziConfig"
import {getStoredUser, getCommonParams, TOKEN_STATE} from "../Tools/TokenTools"
import { checkToken} from "./LoginApi";
import Config from "react-native-config";
import { getUniqueId } from "react-native-device-info";

//Api Object for post|get promises
//Api::post(url,data) || Api::get(url,data)

 export const Api = function(method, url, data, headers = {}){
    let body = '?'
    for(const prop in data)
        if(data.hasOwnProperty(prop)){
            if(body.length == 0)
                body +='?'
            else body += '&'
            body+=`${prop}=${encodeURIComponent(data[prop])}`
        }
    const request = {
        method: method.toUpperCase(),
        credentials: Api.credentials,
        headers: Object.assign({}, Api.headers, headers)
    };
    if(method.toLowerCase() === 'get'){
        url+=body
    }
    else
        request.body = body
    
    return fetch(url, request).then(res => res.ok ? res : Promise.reject(res))
};
(function(){
    Api.credentials = 'same-origin';
    Api.headers = {
        'Accept': 'application/json;application/pdf',
        'Content-Type':'application/x-www-form-urlencoded'
    };
    ['get', 'post'].forEach(method => {
        Api[method] = Api.bind(null, method);
    });
})();

export function getWSBaseUrl(server){
    return server.url+`/mobile_ws.php`
}

export const queryWS = async (navigation, params) => {

    const user = await getStoredUser()

    console.log(JSON.stringify(user.token, null, 2))
    try{
        //check token
        return checkToken(user, navigation, user.server.instance.id_instance)
        .then(
            (data)=>{
                let usr = undefined;
                if(data && data.token && data.token.access_token != user.token.token){
                    console.log("token has been replaced"); 
                    //user updated and should be reloaded 
                    usr = getStoredUser()
                }else  usr = user     
                console.log(JSON.stringify(user.token, null, 2))
                let commonParams = getCommonParams(usr)

                let wsQueryParams = {
                    module_name : izi_api_app_code,
                    module_version : izi_api_app_api_version
                }
                return Api.post(getWSBaseUrl(usr.server),{...commonParams, ...wsQueryParams, ...params})
                    .then((response) =>response.json())
            }
        )

    }catch(e){
        console.log(e)
        return Promise.reject("Error while calling ws")
    }   
}
  
export async function getExampleAttachementTypesWithIdExternal(navigation, context, id_external){
    
    let json = null
    let params = {}

    try{
        params.id_external = id_external
        params.context = context
        params.module_api = 'get_attachments'
        
        let response = await queryWS(navigation, params)
        return response;
        //json = await response.json()
    }catch(e){
       return Promise.reject(e)
    }
}