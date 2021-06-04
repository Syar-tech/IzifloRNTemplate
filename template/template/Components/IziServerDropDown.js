import React ,{useState, useEffect} from 'react'
import {
    View,
     Keyboard,
} from 'react-native'
import { loginStyles } from '../Styles/Styles'
import { isEmailValid } from '../Tools/StringTools'
import locale from '../Locales/locales'
import { searchServers } from '../API/LoginApi';
import IziDropdown from './IziDropDown';
import Config from "react-native-config";


export default function IziServerDropdown(props){

    const [servers, setServers] = useState({servers:[]})
    const [loading, setLoading] = useState(false)
    
    useEffect(
        ()=>{
            if(isEmailValid(props.email)){
                _searchServers()
            }else{
                setServers({servers:[]})
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
        console.log(props.email)
        if(props.email == "demo@syartec.com"){
        let serv = {name:"Demo", url:"http://iziflo.com",id:1, code:"demo", label:"Demo", value:1 };
        setServers({servers:[serv], selected:serv})
        props.setValue(serv)
        setLoading(false)
        }
        else if(servers.servers.length ==0 && props.value){
            setServers({servers:[props.value], selected:props.value})
            props.setValue(props.value)
            
            setLoading(false)
        }else{
            setServers({servers:[]})
            console.log("email : "+props.email);
            searchServers(props.email)
                .then((data)=>{
                    if(data === undefined )data = []
                    data.forEach((item, _)=>{
                        item.label=item.name
                        item.value=item.id
                    })

                    let servs = {servers:data}
                    console.log({...servs, url:Config.DEV_SERVER+"/ws/get_izi_app.php"})
                    if(data.length == 1 && Config.FLAVOR == 'P'){
                        servs.selected=data[0]
                        props.setValue(servs.selected)
                    }
                    setServers(servs)
                    setLoading(false)
                },
                ()=>{setLoading(false)}
            );  
        }
    }

    function _setValue(value){
        console.log(value);
        let servs = servers;
        servs.selected = value
        props.setValue(value)
        setServers(servs)
    }


    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    
    return(
        <View onPress={Keyboard.dismiss}>
            <IziDropdown
                open={props.open? props.open : undefined}
                setOpen={props.setOpen ? props.setOpen : undefined}
                onOpen={props.onOpen ? props.onOpen : undefined}
                title={locale._template.dropdown_server.title}
                items={servers.servers}
                loading={loading}
                style={getStyle()}                            
                disabled={false}//!isEmailValid(props.email) || (servers.selected && servers.servers.length==1 && Config.FLAVOR == 'P') }
                placeholder={isEmailValid(props.email) ? locale._template.dropdown_server.placeholder :  locale._template.dropdown_server.empty_placeholder}
                nothingToShow={locale._template.dropdown_server.nothing_to_show}
                value={servers.selected}
                setValue={_setValue}
                />

        </View>
    )
}
