import React ,{useState, useImperativeHandle, useEffect} from 'react'
import {
    View, Text, StyleSheet, Modal, Pressable, Alert, Image,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    SafeAreaView
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button ,{IziButtonStyle}from '../Components/IziButton'

import { colors } from '../Styles/Styles'
import { useSelector } from 'react-redux';
import { useLanguage } from '../Locales/locales';
import IziTextInput from '../Components/IziTextInput';
import { __debug } from '../Tools/DevTools';



export const ERROR_ON_AUTH_CODE = {
    NEW_CODE : "NEW_CODE",
    EMAIL_ERROR : "ERROR_WHILE_SENDING_MAIL",
    TOO_MANY_TRIES : "TOO_MANY_TRIES",
    USED_CODE : "USED_CODE",
    CODE_OK : "CODE_OK",
    CODE_EXPIRED : "CODE_EXPIRED",
    WRONG_CODE : "WRONG_CODE",

}

const DoubleAuthModal = React.forwardRef(({
    errorCode=undefined,
    email='',
    resetError = () => {},
    onSendAgain= (code) => {},
}, ref ) => {


    const {locale} = useLanguage()

    const user = useSelector((state)=> state._template?.user)

    const [code, setCode] = useState('')
    const [resendLoader, setResendLoader] = useState(false)
    const [confirmLoader, setConfirmLoader] = useState(false)

    const [resendExpiryDate, setResendExpiryDate] = useState(undefined)
    const [resendCountdown, setResendCountDown] = useState(0)

    useImperativeHandle(ref, ()=>({
        resetLoaders: ()=>{
            setResendLoader(false);
            setConfirmLoader(false);
            if(errorCode == ERROR_ON_AUTH_CODE.NEW_CODE){
               
            }
        }
    }))


    useEffect(()=>{
        if(!errorCode) {
            setCode('')
        }
        setResendLoader(false)
        setConfirmLoader(false)
    }, [errorCode])


    useEffect(() => {
        if(resendExpiryDate){
            const calculateCountdown = (timeDifference) => {
                const seconds = Math.floor(
                    timeDifference / 1000
                );
                setResendCountDown(seconds)
            };

            const updateCountdown = () => {
                const currentDate = new Date().getTime();
                const expiryTime = resendExpiryDate.getTime();
                const timeDifference = expiryTime - currentDate;

                if (timeDifference <= 0) {
                    // Countdown finished
                    calculateCountdown(0);
                } else {
                    calculateCountdown(timeDifference);
                }
            };

            updateCountdown();
            const interval = setInterval(updateCountdown, 1000);

            return () => clearInterval(interval);
        }
    }, [resendExpiryDate]);



    const canEnterCode = errorCode != ERROR_ON_AUTH_CODE.TOO_MANY_TRIES && errorCode != ERROR_ON_AUTH_CODE.USED_CODE && errorCode != ERROR_ON_AUTH_CODE.EXPIRED_CODE

    const _getValidateButtonStyle = () => {
        return (code?.length > 0 && canEnterCode ) 
            ?  IziButtonStyle.action 
            : IziButtonStyle.disabled
    }

    const _confirm = () => {
        if(code?.length && canEnterCode && !confirmLoader){
            setConfirmLoader(true)
            onSendAgain(code)
        }
    }

    const sendAgain = () => {
        if(!resendLoader && resendCountdown<=0){
            const expiry = new Date(new Date().getTime() + 60*1000)
            setResendExpiryDate(expiry)
            setResendLoader(true)
            onSendAgain()
        }
    }


    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={!!errorCode}
        >   
        <SafeAreaView>
            <TouchableWithoutFeedback style={styles.centeredView} onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalView}>
                    <View style={{height:60, justifyContent:'center', alignItems:'center'}}>
                        <Text style={{fontSize:20, fontWeight:'bold'}}>{locale._template.double_auth_title}</Text>
                        <Pressable
                            style={{position:'absolute', right:20, height:50, width:50,backgroundColor:'white', alignItems:'center', justifyContent:'center'}}
                            onPress={resetError}>
                                <Icon style={{}} name="close" size={44} color={colors.iziflo_blue}/>
                        </Pressable>
                    </View>
                    <View style={{padding:35, flex:1, alignItems:'stretch'}}>
                        <View style={{flex:1}}/>
                        <Text style={{textAlign:'center', fontSize:20, marginBottom:30}}>{locale._template.double_auth_message}</Text>
                        <IziTextInput 
                            style={{marginBottom:12}} 
                            title={locale._template.email_input.title} 
                            value={email} 
                            editable={false}
                        />
                        <IziTextInput 
                            title={locale._template.double_auth_code_input.title} 
                            keyboardType='number-pad' autoCapitalize='none' 
                            placeholder={locale._template.double_auth_code_input.placeholder}
                            value={code}  
                            onChangeText={setCode}
                            maxLength={4}
                            editable={canEnterCode}
                        />
                        <Text 
                            style={{marginBottom:24, color:"red"}} >{locale._template["double_auth_error_"+errorCode] || ''}</Text>
                        <Button  
                            title={locale._template.confirm.toUpperCase()} 
                            iziStyle={_getValidateButtonStyle()}
                            onPress={_confirm }
                            loading={confirmLoader}/>
                        <View style={{flex:1}}/>
                        <View style={{flexDirection:'row', alignSelf:'center'}}>
                            <Text style={{ fontSize:14}}>{locale._template.double_auth_email_not_received}</Text>
                            <TouchableWithoutFeedback style={{margin:6, backgroundColor:'white'}} onPress={sendAgain}>
                                <View style={{alignItems:"center", width:100}}>
                                    {resendCountdown>0 && !resendLoader && <Text style={{ fontSize:14, color: "lightgray", fontWeight: "normal"}}>{resendCountdown + 's'}</Text>}
                                    {resendCountdown<=0 && !resendLoader && <Text style={{ fontSize:14, color:colors.iziflo_blue, fontWeight: 'bold'}}>{locale._template.double_auth_email_send_again}</Text>}
                                    {resendLoader && (<ActivityIndicator color={colors.iziflo_blue} size='small'/> )}
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={{flex:2}}/>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
        </Modal>
    )
})


const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width:"100%",
      height:"100%",
      backgroundColor: "white",
      alignItems: "stretch",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "left"
    }
  });

  export default  DoubleAuthModal
