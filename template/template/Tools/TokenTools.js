
import SInfo from 'react-native-sensitive-info';
import {__SInfoConfig} from '../Tools/Prefs';
import Config from "react-native-config";
import {getUniqueId} from 'react-native-device-info'
import {izi_api_client_id} from "../../config/iziConfig"

export async function getStoredUser(){
    let userData =  await SInfo.getItem("loginState", __SInfoConfig);
    if(userData){
        return JSON.parse(userData);
    }else return undefined;
}
export async function deleteStoredUser(){
    await SInfo.deleteItem("loginState", __SInfoConfig);
}

export async function storeUser(user){
    await SInfo.setItem("loginState",user,  __SInfoConfig);
}

export async function disconnect(navigation){
    await deleteStoredUser();
    if(navigation) navigation.navigate("Login");
}


export const TOKEN_STATE = {
    VALID:"VALID",
    INVALID:"INVALID",
    BLOCKED:"BLOCKED",
    OBSOLETE:"OBSOLETE",
}

export const getCommonParams = (user = null) =>  {
    let params =  {
        client_id : izi_api_client_id,
        module_name : 'core',
        module_version:Config.CORE_VERSION,
        device_id:getUniqueId()
    }
    if(user){
        params.token = user.token.token
        params.login_type = user.token.tokenType
    }
    return params;
}