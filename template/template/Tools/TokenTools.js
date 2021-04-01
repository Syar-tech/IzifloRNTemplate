
import SInfo from 'react-native-sensitive-info';
import {__SInfoConfig} from '../Tools/Prefs';

export async function getStoredUser(){
    let userData =  await SInfo.getItem("loginState", __SInfoConfig);
    if(userData){
        return JSON.parse(userData);
    }else return undefined;
}
export async function deleteStoredUser(navigation){
    await SInfo.deleteItem("loginState", __SInfoConfig);
}

export async function storeUser(user){
    await SInfo.setItem("loginState",user,  __SInfoConfig);
}

export async function disconnect(navigation){
    await deleteStoredUser(navigation);
    if(navigation) navigation.navigate("Login");
}


export const TOKEN_STATE = {
    VALID:"VALID",
    INVALID:"INVALID",
    BLOCKED:"BLOCKED",
    OBSOLETE:"OBSOLETE",
}