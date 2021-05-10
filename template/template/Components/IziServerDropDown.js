import React ,{useState, useEffect, useRef, memo} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback, Keyboard,
} from 'react-native'
import { loginStyles } from '../Styles/Styles'
import { isEmailValid } from '../Tools/StringTools'
import locale from '../../Locales/locales'
import { searchServers } from '../API/LoginApi';
import IziDropdown from './IziDropDown';
import Config from "react-native-config";


export default function IziServerDropdown(props){

    const [serverList, setServerList] = useState([])
    const [loading, setLoading] = useState(false)
    
    useEffect(
        ()=>{
            if(isEmailValid(props.email)){
                _searchServers()
            }else{
                setServerList([])
            }
        }
        ,[props.email])

    let getStyle = ()=>{
        if(typeof props.style  ==="object"){
            return {
                ...loginStyles.dropdown, ...props.style}
        }else
        return loginStyles.dropdown
    }

    /*---------------------------
    -
    -         functions
    -
    ----------------------------*/
    const _searchServers = async ()=>{
        setLoading(true);

        console.log("server : "+JSON.stringify(props.value) + (serverList.length ==0 && props.value != undefined) )
        if(serverList.length ==0 && props.value){
            setServerList([props.value])
            props.setValue(props.value);
            setLoading(false)
        }else{
            setServerList([])
            searchServers(props.email)
                .then((data)=>{
                    if(data.length == 0){
                        if(controller ) controller.close()
                    }
                    data.forEach((item, _)=>{
                        item.label=item.name
                        item.value=item.id
                    })

                    setServerList(data)
                    if(data.length == 1 /*&& Config.FLAVOR == 'P'*/){
                    props.setValue(data[0]);
                    }
                    setLoading(false)
                },
                ()=>{setLoading(false)}
            );  
        }
    }


    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    return(
        <View onPress={Keyboard.dismiss}
        zIndex={props.zIndex}>
            <IziDropdown
                            title={locale._template.dropdown_server.title}
                            items={serverList}
                            loading={loading}
                            style={getStyle()}                            
                            disabled={!isEmailValid(props.email) || (props.value && serverList.length==1 && Config.FLAVOR == 'P') }
                            placeholder={isEmailValid(props.email) ? locale._template.dropdown_server.placeholder :  locale._template.dropdown_server.empty_placeholder}
                            nothingToShow={locale._template.dropdown_server.nothing_to_show}
                            value={props.value}
                            setValue={props.setValue}
                            zIndex={props.zIndex}
                            />

        </View>
    )
}
