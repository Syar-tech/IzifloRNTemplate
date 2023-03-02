import React, { useReducer, useState } from 'react'
import {View,useWindowDimensions, StyleSheet, Image, Keyboard} from 'react-native'
import { resetPassword } from '../API/LoginApi';
import Button ,{IziButtonStyle}from '../Components/IziButton'
import IziTextInput from '../Components/IziTextInput';
import { useLanguage } from '../Locales/locales';
import { IziDimensions } from '../Tools/Dimensions';
import { isEmailValid, isEmpty } from '../Tools/StringTools';
import IziServerDropdown from '../Components/IziServerDropDown';


export default function ForgotPasswordScene({navigation}){

    const {locale} = useLanguage()

    const [dropdownOpen, setDropdownOpen] = useReducer((state, action)=>{return {...state, ...action}},{server:false, server2:false, instances:false})

    const [email,setEmail] = useState('')

    const [server, setServer] = useState(undefined)

    const onButtonPressed = async () => {
        const json = await resetPassword(server, email)
        let message = locale._template.an_email_was_sent_with_a_new_password
        if(json.error){
            switch(json.error){
                case 'user_not_found':
                    message = locale._template.user_not_found
                break
                default:
                    message = locale._template.unknown_error_title
                break
            }
        }

        navigation.navigate('ErrorScene',{
            errorMessage: message,
            icon:json.success ? 'validate' : 'warning',
            closeDelay:{delay:3000, callback: () =>{ navigation.navigate(json.error ? 'ForgotPassword' : 'Login',{})}}
        })
    }

    const _closeAll = (omit= {server:false, server2:false, instances:false})=>{
        if(!!!omit?.keyboard) Keyboard.dismiss()
        setDropdownOpen({...{server:false, server2:false, instances:false}, ...omit})
    }

    const window = useWindowDimensions()

    const _getConnectButtonStyle = () => {
        return (
            !isEmpty(email) 
            && isEmailValid(email) && server) 
            ?  IziButtonStyle.green 
            : IziButtonStyle.disabled
    }

    return (
        <View style={loginStyles.container}>
            <View style={loginStyles.login_container}>
                <Button 
                    style={IziDimensions.getDimension(window, loginStyles.connect_button)}
                    title={locale._template.back}
                    onPress={() => navigation.goBack()}/>

                <Button 
                    style={IziDimensions.getDimension(window, loginStyles.connect_button)} 
                    title={locale._template.forgotten_pass_title} 
                    iziStyle={_getConnectButtonStyle()}
                    onPress={onButtonPressed}/>

                <IziServerDropdown 
                    open={dropdownOpen.server}
                    setOpen={(value)=>{setDropdownOpen({server:value})}}
                    onOpen={() => {
                        _closeAll({server:true})
                    }}
                    style={{marginTop:12}} 
                    email={email} 
                    value={server} 
                    setValue={(item)=>{setServer(item)}}
                />

                <IziTextInput style={{marginBottom:12}} title={locale._template.email_input.title} keyboardType='email-address' placeholder={locale._template.email_input.placeholder} 
                    autoCapitalize='none' autoCorrect={false}
                    value={email}  onChangeText={(value) => {setEmail(value)}} />

                <Image style={IziDimensions.getDimension(window,loginStyles.logo)} source={require(("../res/logo-iziflo.png"))}/> 
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10
    }
})

const loginStyles = {
    connect_button:{
        qdef:{
            alignSelf:'center',
            width:250,
            marginTop:10
        },
        q420sw:{
            marginTop:10,
        }
    },
    container:{
        flex:1,
        padding:10,
        width:'100%',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center'
    },
    login_container:{
        flex:1,
        flexDirection:'column-reverse',
        justifyContent:'center',
        alignItems:'stretch',
        backgroundColor:'white',
        paddingEnd:40,
        paddingStart:40,
        maxWidth:500,
        width:'100%'
    },
    logo:{
        qdef:{
            height:120 ,
            width:300,
            resizeMode:'contain',
            alignSelf:'center',
        },
        q420sw:{
            height:200 ,
        }
       
    },
}