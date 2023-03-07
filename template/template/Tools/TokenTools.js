import React from 'react'
import SInfo from 'react-native-sensitive-info';
import {Platform, Text} from 'react-native'
import {__SInfoConfig} from '../Tools/Prefs';
import Config from "react-native-config";
import deviceInfoModule, {getReadableVersion, getUniqueId} from 'react-native-device-info'
import {izi_api_client_id} from "../../config/iziConfig"
import { ACTIONS_TYPE } from '../../Store/ReduxStore';
import NetInfo from "@react-native-community/netinfo";
import icon_back from '../res/img/icon_back';
import icon_validate from '../res/img/icon_validate';
import { B } from '../Styles/Styles';

export async function storeUser(user){
    await SInfo.setItem("loginState",user,  __SInfoConfig);
}

export async function disconnect(navigation, dispatch,locale){
    console.log("disconnect", navigation.navigate)
    if(navigation && locale)
        return navigation.navigate('ErrorScene',{
            errorMessage: <Text>{locale._template.dataInProgress +"\n"}<B>{locale._template.doYouConfirm}</B></Text>,
            icon:'warning',
            footerButtons:[{
                image:icon_back,
                text:locale._template.back,
                isBackButton:true
            },{
                image:icon_validate,
                text:locale._template.confirm,
                onPress : async () => {
                    await dispatch({type:ACTIONS_TYPE.USER_DISCONNECT})
                    navigation.reset({
                        routes:[{name:'Login'}]
                    })
                    navigation.navigate("Login");
                }
            }]
        })
    
    await dispatch({type:ACTIONS_TYPE.USER_DISCONNECT})
    if(navigation) {
        console.log('navigate to login')
        navigation.reset({
            routes:[{name:'Login'}]
        })
        navigation.navigate("Login");
    }
}


export const TOKEN_STATE = {
    VALID:"VALID",
    INVALID:"INVALID",
    BLOCKED:"BLOCKED",
    OBSOLETE:"OBSOLETE",
}

export const getCommonParams = async (user = null, addInstance = true) =>  {
    let params =  {
        client_id : izi_api_client_id,
        module_name : 'core',
        core_version : Config.CORE_VERSION,
        module_version:Config.CORE_VERSION,
        device_id:Platform.OS+"_"+getUniqueId(),
        os_version: Platform.OS + ' ' + Platform.Version,
        network: (await NetInfo.fetch())?.type,
        model_name: deviceInfoModule.getBrand() + ' ' + deviceInfoModule.getModel(),
        app_version: getReadableVersion()
    }
    if(user){
        params.email = user.email
        params.token = user.token.token
        params.login_type = user.token.tokenType
        if(addInstance) params.id_instance = user.server.instance.id_instance
    }
    return params;
}


export const generateRandomKey = (length)=>{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
