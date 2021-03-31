import React ,{useState, useEffect, useRef, memo} from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback, Keyboard,
} from 'react-native'
import IziDropDown from './IziDropDown';
import { loginStyles } from '../Styles/Styles'
import { isEmailValid } from '../Tools/StringTools'
import locale from '../../Locales/locales'
import { searchServers } from '../API/LoginApi';
import IziDropdown from './IziDropDown';
import {getStoredUser} from '../Tools/TokenTools';


export default function IziServerDropdown(props){

    const [serverList, setServerList] = useState([])
    let  controller = undefined
    
    useEffect(
        ()=>{
            if(isEmailValid(props.email)){
                _searchServers()
            }else{
                if(controller) controller.close()
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
        searchServers(props.email)
            .then((data)=>{
                if(data.length == 0){
                    if(controller ) controller.close()
                }
                data.forEach((item, index)=>{
                    item.label=item.name
                    item.value=item.id
                })
                setServerList(data)
            });
    }


    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    return(
        <View onPress={Keyboard.dismiss}>
            <IziDropdown
                            controller={(instance)=> controller = instance}
                            title={locale._template.dropdown_server.title}
                            items={serverList}
                            style={getStyle()}
                            disabled={!isEmailValid(props.email)}
                            placeholder={isEmailValid(props.email) && serverList.length > 0  ? locale._template.dropdown_server.placeholder :  locale._template.dropdown_server.empty_placeholder}
                            onChangeItem={props.onChangeItem}
                            />

        </View>
    )
}
