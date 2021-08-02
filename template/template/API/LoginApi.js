import {demo_flavor, isDemo, izi_api_app_code} from "../../config/iziConfig"
import Config from "react-native-config";
import {getCommonParams,storeUser,TOKEN_STATE} from '../Tools/TokenTools'
import {disconnect } from "../Tools/TokenTools"
import {Api, getWSBaseUrl} from '../API/WSApi'
import { TOKEN_TYPE } from "../Types/LoginTypes";
import MSALConnect from '../API/MSALConnectApi'


const core_version = Config.CORE_VERSION


export function searchServers(email){
  var params = {
    email:email,
    app_code:izi_api_app_code,
    app_type:isDemo(email) ? demo_flavor :  Config.FLAVOR,
    core_version:Config.CORE_VERSION
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
  
  return Api.post(getWSBaseUrl(server),params)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

export async function resetPassword(server, email){
  const params = getCommonParams()
  params.module_api = 'forgot_password'
  params.email = email

  try{
    return await Api.post(getWSBaseUrl(server),params).then(response => response.json())
    
    
  }catch(e){
    console.log('error',e)
    return false
  }

}

//request token
export function requestToken(server, email, password){
  var params = getCommonParams();
  params.module_api='request_token'
  params.email=email
  params.password=password

  return Api.post(getWSBaseUrl(server),params)
    .then((response) => {
        return response.json()
    })
    .catch((error) => console.error(error))
}

//check token
export async function checkToken( user, navigation){
  switch (user.token.tokenType) {
    case TOKEN_TYPE.IZIFLO:
      {

        let params = getCommonParams(user, true);
        params.module_api="check_token";

        var promise = Api.post(getWSBaseUrl(user.server),params)
          .then((response) => response.json())
          .then(tokenHandler(navigation, user))
          .catch((error) => {console.error(error); Promise.reject(error)})
        return promise;
      }
      case TOKEN_TYPE.MICROSOFT:
        let msal = await getMSALConnect();
        console.log(msal);
        if(msal.isInit()){
          const params = {
              scopes: ["User.Read"],
            };
            const result = await msal.acquireTokenSilent(params)
            .catch((e)=>{console.log("msal : "+ JSON.stringify(e, null, 2)); return e});
            
            if(result && result.idToken){
                let externalToken = {
                      email:result.account.username,
                      token : result.accessToken,
                      state : TOKEN_STATE.VALID,
                      tokenType:TOKEN_TYPE.MICROSOFT
                }
                let usr={
                      ...user,
                      email:externalToken.email,
                      token:externalToken
  
                }
                await storeUser(JSON.stringify(usr))
              
                return Promise.resolve(usr);
              }
          }
        break;
      case TOKEN_TYPE.GOOGLE:
        return user.token;
        break;
  
    default:
      return Promise.reject(user)
  }
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
  return Api.post(getWSBaseUrl(user.server),params)
    .then((response) => {
        return response.json()
    })
    .then((data)=>{
        if(data.success){
          let usr = user;
          usr.token = {
              token:data.success.access_token, 
              refreshToken:data.success.refresh_token, 
              state:TOKEN_STATE.VALID, 
              tokenType:TOKEN_TYPE.IZIFLO, 
              expirationDate:data.success.access_token_expiration_date, 
              refreshExpirationDate:data.success.refresh_token_expiration_date, 
              email:user.email
            }
            storeUser(JSON.stringify(usr))
            return {token : data.success}
        }else if(data.error){
            Promise.reject(data)
        }else{
            Promise.reject(data)
        }
            
    })
        
}

async function getMSALConnect(){
  let msal = new MSALConnect()
  await msal.init()
  return msal

}


function refresMicrosoftToken(user){
  //TODO refresh Microsoft token
}

function refresGoogleToken(user){
  //TODO refresh Google token
}


