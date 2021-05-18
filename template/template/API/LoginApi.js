import {izi_api_app_code} from "../../config/iziConfig"
import Config from "react-native-config";
import {getCommonParams,storeUser,TOKEN_STATE} from '../Tools/TokenTools'
import {disconnect } from "../Tools/TokenTools"
import {Api, getWSBaseUrl} from '../API/WSApi'
import { TOKEN_TYPE } from "../Types/LoginTypes";


const core_version = Config.CORE_VERSION


export function searchServers(email){
  var params = {
    email:email,
    app_code:izi_api_app_code,
    app_type:Config.FLAVOR,
    core_version:core_version
  }
  return Api.get(Config.DEV_SERVER+"/ws/get_izi_app.php",params)
      .then((response) => {
          return response.json()
      })
      .catch((error) => console.error(error))
}

export function requestInstances(server, email, token, tokenType){
  var params = getCommonParams();
  params.module_api='get_instances'
  params.email=email
  params.token=token
  params.login_type=tokenType
  
  console.log("instances call :"+ getWSBaseUrl(server) + '\n'+JSON.stringify(params, null, 2))
  return Api.post(getWSBaseUrl(server),params)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

//request token
export function requestToken(server, email, password){
  var params = getCommonParams();
  params.module_api='request_token'
  params.email=email
  params.password=password

  console.log('params login : '+JSON.stringify(params));
  return Api.post(getWSBaseUrl(server),params)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

//check token
export async function checkToken( user, navigation){
  let params = getCommonParams(user, true);
  params.module_api="check_token";

  var promise = Api.post(getWSBaseUrl(user.server),params)
    .then((response) => response.json())
    .then(tokenHandler(navigation, user))
    .catch((error) => {console.error(error); Promise.reject(error)})
  return promise;
}

/**
 * 
 * @param {*} navigation 
 * @param {*} user if not null, handler will try to renew the token.
 * @returns 
 */
 export function tokenHandler(navigation, user = null){
  return async (json) => {
    if(json.token && json.token.state){
      switch (json.token.state) {
        case TOKEN_STATE.VALID:
            return json;
        case TOKEN_STATE.OBSOLETE:
            if(user){
              return refreshToken(user)
            }else Promise.reject(json)
          break;
        default:
            //TODO 
          console.log("token invalid : "+ JSON.stringify(json.token))
          disconnect(navigation)
          Promise.reject(json);
          break;
      }
    }else {Promise.reject(json)}
  }
}

function refreshToken(user){
  switch (user.token.tokenType) {
    case TOKEN_TYPE.IZIFLO:
      return refreshIzifloToken(user)
        case TOKEN_TYPE.MICROSOFT:
          //TODO refresh MICROSOFT
          return refreshMicrosoftToken(user)
          break;
        case TOKEN_TYPE.GOOGLE:
          return refreshGoogleToken(user)
          break;
  
    default:
      return Promise.reject(user)
  }
}

function refreshIzifloToken(user){

  var params = getCommonParams(user);
  params.module_api='refresh_token'
  params.refresh_token=user.token.refreshToken
  return Api.post(getWSBaseUrl(server),params)
    .then((response) => {
        return response.json()
    })
    .then((data)=>{
      console.log("DATA : "+JSON.stringify(data))
        if(data.success){
            user.token = {
              token:data.success.access_token, 
              refreshToken:data.success.refresh_token, 
              state:TOKEN_STATE.VALID, 
              expirationDate:data.success.access_token_expiration_date, 
              refreshExpirationDate:data.success.refresh_token_expiration_date, 
              email:user.email
            }
            storeUser(JSON.stringify(user))
            return {token : user.token}
        }else if(data.error){
            Promise.reject(json)
        }else{
            Promise.reject(json)
        }
            
    })
        
}


function refresMicrosoftToken(user){
  //TODO refresh Microsoft token
}

function refresGoogleToken(user){
  //TODO refresh Google token
}


