import React ,{useEffect, useState} from 'react'
import PropTypes from "prop-types";
import {
    View, StyleSheet,TouchableOpacity
} from 'react-native'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import {__SInfoConfig} from '../Tools/Prefs';

import {Token,InstanceType,ServerType, User, TOKEN_TYPE} from "../Types/LoginTypes"
import locale from '../../Locales/locales'
//types
import IziDropdown from './IziDropDown'
import IziServerDropDown from './IziServerDropDown'
import { requestInstances } from '../API/LoginApi';
import {isEmailValid} from '../Tools/StringTools';

export interface Props{
    user:User,
    password?:string
    onLogout():void
    onInstanceChoosen(instance:InstanceType):void
}

interface ServerInfo{
    server:ServerType,
    instances?:{
        list?:InstanceType[],
        selectedInstance?:InstanceType
    }
}

 const InstanceChoice : React.FC<Props> = ({user,password, onLogout, onInstanceChoosen}) => {

    const [serverInfo, setServerInfo] = useState<ServerInfo|undefined>(user.server ? {server:user.server} : undefined)
    const isExternal = user.token!= undefined && user.token.tokenType != TOKEN_TYPE.IZIFLO

    useEffect(()=>{
        if(serverInfo?.server && !serverInfo?.instances){
            _requestInstances(serverInfo.server);
        }
    },[serverInfo])

    const _onConnect = ()=>{
        console.log("connect")
        if(serverInfo?.instances?.selectedInstance) onInstanceChoosen(serverInfo.instances.selectedInstance)

    }

    const _getConnectButtonStyle = () => {
        return (serverInfo?.instances?.selectedInstance)
            ?  IziButtonStyle.green 
            : IziButtonStyle.disabled
    }

    const onServerSelected = (server:ServerType)=>{
        if(server)  {
            setServerInfo({server:server});
        }else setServerInfo(undefined)

    }

    const _requestInstances = async (server:ServerType)=>{
        //TODO load instance
        if(server){
            let promise = null;
            if(isExternal){
                promise = requestInstances(server, user.token!!.email, false, user.token!!.token, user.token!!.tokenType)
                //TODO load instance from token
            }else{
                if(!server || !isEmailValid(user.email) || !password) {
                    //TODO error message : missing data
                }else{
                    promise = requestInstances(server, user.email, password)
                }
            }
            if(promise)
                promise.then((data:any)=>{
                    data.data.forEach((instance : InstanceType) => {
                        instance.value=instance.id_instance,
                        instance.label=instance.instance_code + ' - ' + instance.instance_name
                    });
                    setServerInfo({server:server,instances:{list:data.data}});
                })
        }else{
            //TODO no server message
        }
    }

    const _onInstanceSelected = (instance:InstanceType) => {
        if(!serverInfo?.server) setServerInfo(undefined)
        else{
            let info :ServerInfo = {server:serverInfo?.server}
            if(serverInfo.instances?.list) info.instances = {list : serverInfo.instances.list, selectedInstance:instance}
            setServerInfo(info)
        }
    }


    /*----------------------
    *
    *       Display
    *
    *----------------------*/
    const _displayServers= ()=>{
        if(true){
            return (
                <IziServerDropDown 
                        style={{marginTop:12}} 
                        email={user.email ? user.email : user.token?.email} 
                        value={serverInfo?.server} 
                        setValue={(item:ServerType)=>{onServerSelected(item)}}
                        zIndex={2000}
                        />
            )
        }else return undefined
    }
    

    return (
        <View>
            {_displayServers()}
            <IziDropdown
                items={serverInfo?.instances?.list ? serverInfo.instances.list : []}
                title={locale._template.dropdown_instance.title}
                placeholder={serverInfo?.instances?.list && serverInfo.instances.list.length > 0 ? locale._template.dropdown_instance.placeholder :  locale._template.dropdown_instance.empty_placeholder}
                nothingToShow={locale._template.dropdown_instance.nothing_to_show}
                disabled={serverInfo?.instances?.list == undefined || serverInfo.instances.list.length == 0}
                value={serverInfo?.instances?.selectedInstance}
                setValue={(value:InstanceType)=>{_onInstanceSelected(value)}}
                zIndex={1000}/>
                
            <Button style={loginStyles.button} title={locale._template.connect} iziStyle={_getConnectButtonStyle()} onPress={_onConnect }/>
            <Button title={locale._template.disconnect} iziStyle={IziButtonStyle.orange} onPress={onLogout}/>
        </View>
    )
}

const loginStyles = StyleSheet.create({
    button:{
        marginBottom:20,
        marginTop:30,
    },
})

export default InstanceChoice