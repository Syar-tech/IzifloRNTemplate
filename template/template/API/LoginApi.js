import {demo_flavor, isDemo, izi_api_app_code, privileges} from "../../config/iziConfig"
import Config from "react-native-config";
import {getCommonParams,storeUser,TOKEN_STATE} from '../Tools/TokenTools'
import {disconnect } from "../Tools/TokenTools"
import {Api, getWSBaseUrl} from '../API/WSApi'
import { TOKEN_TYPE } from "../Types/LoginTypes";
import MSALConnect from '../API/MSALConnectApi'
import { ACTIONS_TYPE } from "../../Store/ReduxStore";
import deviceInfoModule from "react-native-device-info";
import { Linking, Platform } from "react-native";
import { getVersionCheckName } from "../Tools/Tools";

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
      .catch((error) => console.error("catch search server",error))
}

/** ------------------
 * 
 *  app Update
 * 
 -------------------*/

 export const getVersionAndBuild = () =>{
    let currentVersion = deviceInfoModule.getVersion();// VersionCheck.getCurrentVersion()
    //check version on dev server
    const endIndex = currentVersion.indexOf("-")
    if(endIndex >=0) currentVersion = currentVersion.substring(0, endIndex)
    currentVersion = currentVersion + '.' + deviceInfoModule.getBuildNumber()
    return currentVersion
 }

export function getVersionCheck(versionCheckName){

  var params = {
    izi_app:versionCheckName,
    izi_os:Platform.OS,
    izi_apkMode: Config.IS_BUNDLE  == 'true' ? 'STORE' : 'APK',
    app_code:izi_api_app_code,
    app_type: Config.FLAVOR,
    core_version:Config.CORE_VERSION
  }
  /*Api.get(Config.DEV_SERVER+"/ws/get_izi_app_version.php",params)
  .then((response) => {
      return response.text()
  }).then(res=>console.log('response text',Config.DEV_SERVER,res))
  return undefined*/
  return Api.get(Config.DEV_SERVER+"/ws/get_izi_app_version.php",params)
      .then((response) => {
          return response.json()
      })
      .catch((error) => console.error(error))
}

export function getMandatoryUpdateVersion(idIziApiServer){
  return Api.get(Config.DEV_SERVER+"/ws/get_izi_min_version.php",{
    app_code:izi_api_app_code,
    id_izi_api_server:idIziApiServer
  })
  .then((response) => {
      return response.json()
  })
  .catch((error) => console.error(error))
}

export const openUpdateUrl = async () => {
  let versionCode = await getVersionCheckName()
  // Apk mode, sprint recette, or P23
  let currentVersion = deviceInfoModule.getVersion()
  const endIndex = currentVersion.indexOf("-")
  if(endIndex >=0) currentVersion = currentVersion.substring(0, endIndex)
  currentVersion = currentVersion+'.'+deviceInfoModule.getBuildNumber()
  getVersionCheck(versionCode).then(version =>{
      Linking.openURL(version.url)
  })
}

/** ------------------
 * 
 *  Settings
 * 
 -------------------*/


export async function getSettings(idInstance,server, email, token, tokenType){
  var params = await getCommonParams();
  params.module_api='get_settings'
  params.id_instance = idInstance
  params.email=email
  params.token=token
  params.login_type=tokenType
  params.privileges = Array.isArray(privileges) ? privileges.join(',') : privileges

  try{
    const response = await Api.post(getWSBaseUrl(server),params)
    return await response.json()
  }catch(e){
    console.log(e)
    return false
  }
}

export const loadSettings = async (dispatch,user) =>{
  if(user?.server?.instance?.id_instance && user?.token){
    getSettings(user.server.instance.id_instance,user.server,user.email, user.token?.token, user.token?.tokenType)
      .then(json => {
              if(json?.data){
                let usr = {...user, settings:json.data}
                try{
                  dispatch({type:ACTIONS_TYPE.USER_SET, value:usr});
                } catch (error) {"lang"
                    console.log("Something went wrong", error);
                }
              }else{
                console.log(`settings are empty ${JSON.stringify(json)}`)
              }
            }
        )
      }
  }

export async function requestInstances(server, email, token, tokenType){
  var params = await getCommonParams();
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
  const params = await getCommonParams()
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
export async function requestToken(server, email, password){
  const params = await getCommonParams();
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
export async function checkToken( user, navigation, store){
  
  //console.log("user config", JSON.stringify(user, null, 2))
  switch (user.token.tokenType) {
    case TOKEN_TYPE.IZIFLO:
      {

        let params = await getCommonParams(user, true);
        params.module_api="check_token";


        var promise = Api.post(getWSBaseUrl(user.server),params)
          .then((response) => response.json())
          .then(tokenHandler(navigation,store,  user))
          .catch((error) => {console.error(error); Promise.reject(error)})
        return promise;
      }
      case TOKEN_TYPE.MICROSOFT:
        let msal = await getMSALConnect();
        if(msal.isInit()){
          const params = {
              scopes: ["User.Read"],
            };
            const result = await msal.acquireTokenSilent(params)
            .catch((e)=>{
             console.log("msal : "+ JSON.stringify(e,null,2)); 
              return e
            });

            if(result?.userInfo === null){
              //The userInfo is null when the token has expired
              //We need to disconnect the user
              return disconnect(navigation, store.dispatch)
            }
            
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
                store.dispatch({type:ACTIONS_TYPE.USER_SET, value:usr})
              
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
 export function tokenHandler(navigation, store, user = null){
  return async (json) => {
    if(json.token && json.token.state){
      switch (json.token.state) {
        case TOKEN_STATE.VALID:
            return json;
        case TOKEN_STATE.OBSOLETE:
            if(user){
              return refreshToken(user, store)
            }else Promise.reject(json)
          break;
        default:
            //TODO 
          console.log("token invalid : "+ JSON.stringify(json.token))
          disconnect(navigation, store.dispatch)
          Promise.reject(json);
          break;
      }
    }else {Promise.reject(json)}
  }
}

function refreshToken(user, store){
  switch (user.token.tokenType) {
    case TOKEN_TYPE.IZIFLO:
      return refreshIzifloToken(user, store)
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

async function refreshIzifloToken(user, store){

  var params = await getCommonParams(user);
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
              email:user.email,
            }
            store.dispatch({type:ACTIONS_TYPE.USER_SET, value:usr})
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
