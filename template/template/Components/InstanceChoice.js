import React ,{useEffect, useState} from 'react'
import PropTypes from "prop-types";
import {
    View, StyleSheet, Text, Linking
} from 'react-native'
import Button ,{IziButtonStyle}from './IziButton'
import {__SInfoConfig} from '../Tools/Prefs';

import {InstanceType,ServerType, User, TOKEN_TYPE, ERROR_CODE, ErrorType} from "../Types/LoginTypes"
import {colors} from "../Styles/Styles"
import { useLanguage } from '../Locales/locales'
//types
import IziDropdown from './IziDropDown'
import IziServerDropDown from './IziServerDropDown'
import { getSettings, requestInstances } from '../API/LoginApi';


const InstanceChoice  = ({user,password, onLogout, onInstanceChoosen}) => {


    const [serverInfo, setServerInfo] = useState(user.server ? {server:user.server} : undefined)
    const [errorMessage, setErrorMessage] = useState(undefined)
    const isExternal = user.token!= undefined && user.token.tokenType != TOKEN_TYPE.IZIFLO
    const {locale} = useLanguage()
    

    useEffect(()=>{
        if(serverInfo?.server && !serverInfo?.instances){
            _requestInstances(serverInfo.server);
        }
    },[serverInfo])

    const _onConnect = ()=>{
        console.log("connect")
        if(serverInfo?.server && serverInfo.instances?.selectedInstance){
            let server = serverInfo.server
            server.instance = serverInfo.instances.selectedInstance
            getSettings(serverInfo.instances.selectedInstance.id_instance,server,user.email, user.token?.token, user.token?.tokenType).then(json => {console.log(json);return onInstanceChoosen(server,json.data)})
        }
    }

    const _getConnectButtonStyle = () => {
        if(serverInfo?.instances?.selectedInstance)
            return IziButtonStyle.green 
        else
            return IziButtonStyle.disabled 
    }

    const onServerSelected = (server)=>{
        if(server)  {
            setServerInfo({server:server});
        }else setServerInfo(undefined)
    }

    const _requestInstances = async (server)=>{
        //TODO load instance
        if(server){
            let promise = requestInstances(server, user.email, user.token?.token, user.token?.tokenType)
            
            promise.then((data)=>{
                if(data?.error){
                    switch (data.error.code) {
                        case ERROR_CODE.UNKNOWN_USER:
                            let account = ''
                            if(user.token?.tokenType == TOKEN_TYPE.MICROSOFT)
                                account = locale._template.office_365
                            if(user.token?.tokenType == TOKEN_TYPE.GOOGLE)
                                account = locale._template.google
                            console.log("account" + account)
                            setErrorMessage(
                                {
                                    title:locale.formatString(locale._template.unknown_external_account_title, account).toString(),
                                    message:locale.formatString(locale._template.unknown_external_account_message, account).toString(),
                                    action_button:{
                                        title:locale._template.unknown_external_account_link,
                                        link:serverInfo?.server.url
                                    },

                                }
                            )
                            break;
                        case ERROR_CODE.NO_INSTANCE:
                            setErrorMessage(
                                {
                                    title:locale._template.dropdown_instance.no_instance_title,
                                    message:locale._template.dropdown_instance.no_instance_message
                                }
                            )
                            break;
                    
                        default:
                            console.log("error on instances : " + JSON.stringify(data, null, 2))
                            throw new Error(data)
                    }
                }else if(data?.data){
                    //console.log("data", data?.data);
                    data.data.forEach((instance) => {
                        instance.value=instance.id_instance,
                        instance.label=instance.instance_code + ' - ' + instance.instance_name
                    });

                    console.log("afterdata");
                    setServerInfo({server:server,instances:{list:data.data}});
                } else{
                    throw new Error(data)
                }
            }).catch(
                ()=>{
                    console.log('on error')
                    setErrorMessage(
                        {
                            title:locale._template.unknown_error_title,
                            message:locale._template.unknown_error_message
                        }
                    )
                }
            )
        }else{
            //TODO no server message
        }
    }

    const _onInstanceSelected = (instance) => {
        if(!serverInfo?.server) setServerInfo(undefined)
        else{
            let info = {server:serverInfo?.server}
            if(serverInfo.instances?.list) info.instances = {list : serverInfo.instances.list, selectedInstance:instance}
            setServerInfo(info)
        }
    }

    const _onLogout = () => {
        setErrorMessage(undefined)
        onLogout()
    }


    /*----------------------
    *
    *       Display
    *
    *----------------------*/
    const _displayServers= ()=>{
        if(isExternal){
            return (
                    <IziServerDropDown 
                            style={{marginTop:12}}
                            email={user.email ? user.email : user.token?.email} 
                            value={serverInfo?.server} 
                            setValue={(item:ServerType)=>{onServerSelected(item)}}/>
            )
        }else return undefined
    }

    const _displayInstancesOrError = ()=>{
        if(errorMessage){
            return(
            <View style={{ width:'100%'}}>
                <Text style={loginStyles.error_title}>{errorMessage.title ? errorMessage.title : ''}</Text>
                <Text style={loginStyles.error_message}>{errorMessage.message ? errorMessage.message : ''}</Text>
            </View>)
        }else{
            return (
                <View style={{ width:'100%'}}>
                <IziDropdown
                    items={serverInfo?.instances?.list ? serverInfo.instances.list : []}
                    title={locale._template.dropdown_instance.title}
                    placeholder={serverInfo?.instances?.list && serverInfo.instances.list.length > 0 ? locale._template.dropdown_instance.placeholder :  locale._template.dropdown_instance.empty_placeholder}
                    nothingToShow={locale._template.dropdown_instance.nothing_to_show}
                    disabled={serverInfo?.instances?.list == undefined || serverInfo.instances.list.length == 0}
                    value={serverInfo?.instances?.selectedInstance}
                    setValue={(value)=>{_onInstanceSelected(value)}}/>
                    </View>
            )
        }
    }
    

    return (
        <View style={{width:'100%',alignItems:'stretch',maxWidth:500, alignSelf:'center'}}>
            
                
                {_displayServers()}
                {_displayInstancesOrError()}
            <Button 
                style={loginStyles.button} 
                title={errorMessage?.action_button ? errorMessage.action_button.title : locale._template.connect_upper} 
                iziStyle={errorMessage?.action_button ? IziButtonStyle.action :_getConnectButtonStyle()} 
                onPress={()=>{
                        errorMessage?.action_button 
                            ? Linking.openURL(errorMessage.action_button.link)
                            : _onConnect()
                    }
                }
                />
                <Button style={loginStyles.button} title={errorMessage ? locale._template.back : locale._template.disconnect_upper} iziStyle={IziButtonStyle.orange} onPress={_onLogout}/>
        </View>
    )
}

const loginStyles = StyleSheet.create({
    button:{
        marginTop:30,
        width:250,
        alignSelf:'center'
    },
    error_title:{
            color:colors.iziflo_blue,
            fontWeight:'bold',
            fontSize:16,
        },
        error_message:{
        color:colors.iziflo_blue,
        fontSize:16,
    },
})

export default InstanceChoice