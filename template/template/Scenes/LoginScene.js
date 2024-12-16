import React ,{useState, useEffect, useReducer, useCallback, useRef} from 'react'
import {
    View, Text,Image, Alert,BackHandler, Keyboard,TouchableWithoutFeedback,TouchableOpacity, KeyboardAvoidingView,
} from 'react-native'
import { connect, useDispatch, useSelector } from 'react-redux'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import InstanceChoice from '../Components/InstanceChoice'
import Loader from '../Components/IziLoader'
import IziTextInput from '../Components/IziTextInput'
import IziServerDropDown from '../Components/IziServerDropDown'
//libs
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect, useIsFocused} from '@react-navigation/native' 
import { useWindowDimensions } from 'react-native'
import Config from "react-native-config";

import { B, colors } from '../Styles/Styles'
import {useLanguage } from '../Locales/locales'

//Tools
import {loadSettings, requestToken} from '../API/LoginApi'
import {__SInfoConfig} from '../Tools/Prefs';
import {  TOKEN_STATE, disconnect} from '../Tools/TokenTools';
import {isEmpty, isEmailValid, formatDateToYmdHs} from '../Tools/StringTools';
//types
import PINCode from '@haskkor/react-native-pincode'
import MSALConnect from '../API/MSALConnectApi'
import { IziDimensions } from '../Tools/Dimensions';
import { TOKEN_TYPE } from "../Types/LoginTypes";
import { ACTIONS_TYPE } from '../../Store/ReduxStore'
import icon_back from '../res/img/icon_back'
import icon_validate from '../res/img/icon_validate'
import { __debug } from '../Tools/DevTools'
import DoubleAuthModal, { ERROR_ON_AUTH_CODE } from '../Modal/DoubleAuthModal'


const LoginScene = ({navigation, route }) => {

    /*---------------------------
    -
    -         State
    -
    ----------------------------*/
    //local
    const {locale, localeIdentifier} = useLanguage()
    const storedUser = useSelector(state=>state._template?.user)
    const window = useWindowDimensions()
    const focused = useIsFocused();
    const [email, setEmail] = useState(undefined)
    const [password, setPassword] = useState(undefined)
    const [loading, setLoading] = useState(true)
    const [server, setServer] = useState(undefined)
    const [showInstances, setShowInstances] = useState(false)
    const [msal] = useState(new MSALConnect())
    const [dropdownOpen, setDropdownOpen] = useReducer((state, action)=>{return {...state, ...action}},{server:false, server2:false, instances:false})

    const [doubleAuthCode, setDoubleAuthDataCode] = useState(undefined)
    const [doubleAuthDate,  setDoubleAuthDataDate] = useState(undefined)

    const doubleAuthModal = useRef()


    //data
    const [user, setUser] = useState(undefined)

    const dispatch = useDispatch()


    useEffect(()=>{
        _initOffice()
        checkInitialDoubleAuthCode()
    }, [])
    
    useEffect(()=>{
        let timeout = undefined
        if(focused){
            timeout = setTimeout(() => _loadUser(), 200) // too let time to system to disconnect user if necessary
        }
        else setUser(undefined)
        
        return () => timeout ? clearTimeout(timeout) : undefined
    }, [focused])

    useEffect(()=>{
        if(_isLoggedIn()){
            loadSettings(dispatch,user)
        }
    }, [user])


    /*---------------------------
    -
    -         inits 
    -
    ----------------------------*/
    const _initOffice = async ()=>{
        if(!msal.isInit()){
            await msal.init()
        }
        
    }

    const checkInitialDoubleAuthCode = () => {
        
        if(storedUser?.double_auth_date && !storedUser?.disconnected && storedUser?.token?.tokenType == TOKEN_TYPE.IZIFLO && !isNaN(parseInt(storedUser?.settings?.userCodeDelay))){
            //check double auth validity

            __debug("check double auth")
            if(new Date().getTime() > (new Date(storedUser?.double_auth_date+'Z').getTime() + storedUser?.settings?.userCodeDelay* 1000*60*60*24)){
                __debug("disconnect on start")
                disconnect(navigation, dispatch, null, true)
            }
        }
    }

    /*---------------------------
    -
    -         back handler
    -
    ----------------------------*/

    useFocusEffect(
        useCallback(()=>{
            const backAction = () => {
                if(route.name == "Login"){
                    Alert.alert("Hold on!", "Are you sure you want to go back?", [
                        {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel",
                        },
                        { text: "YES", onPress: () => BackHandler.exitApp() }
                    ],
                    {cancelable:true});
                    return true
                }else{
                    return false
                }
            }
            BackHandler.addEventListener('hardwareBackPress', backAction);
            return () =>
                BackHandler.removeEventListener('hardwareBackPress', backAction);
        }, )
    )



    /*---------------------------
    -
    -         Storage
    -
    ----------------------------*/

    const _resetUser= ()=>{
        try{
            disconnect(false, dispatch,locale)
            setUser(undefined)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
    // create a function that saves your data asyncronously
    const _storeUser = async (user, shouldSetUser = true) => {
        try{
            dispatch({type:ACTIONS_TYPE.USER_SET, value:user});    
            if(shouldSetUser)
                setUser(user)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
    

    const _loadUser = async ()=>{
        try {
            await setLoading(true)
            let usr = storedUser?.disconnected ? false : storedUser
            setUser(usr)
            if(!usr) {
                await setServer(undefined)
            }
          } catch (error) {
            console.log("Something went wrong", error);
          }
          setLoading(false)
      
    }

    const _setPin = (pin)=>{
        if(user){
            setLoading(true)
            user.pin = pin
            dispatch({type:ACTIONS_TYPE.USER_PIN_SET, value:pin});
        }
    }

    const _isLoggedIn = () => {
        return user?.server?.instance && user?.token
    }
    /*---------------------------
    -
    -         Connection
    -
    ----------------------------*/

    

    function _connect(forceAuthCode= false, doubleAuthCode = undefined){
        if(server){
            let promise  = null;
            
            if(!isEmailValid(email) || !password) {
                //TODO error message : missing data
            }else{
                //connect to instance
                promise = requestToken(server, email, password, forceAuthCode, doubleAuthCode, localeIdentifier)
            }

            if(promise)
                setLoading(true)
                promise.then((data)=>{
                    if(data?.success){
                        let usr = {
                            email : email, 
                            token : {
                                state:TOKEN_STATE.VALID,
                                tokenType:TOKEN_TYPE.IZIFLO,
                                token:data.success.access_token ,
                                expirationDate:data.success.access_token_expiration_date, 
                                refreshToken:data.success.refresh_token ,
                                refreshExpirationDate:data.success.refresh_token_expiration_date, 
                                email:email}, 
                            server:server
                        }
                        setUser(usr)
                        if(storedUser?.email && email != storedUser.email){
                            //reset old user 
                            disconnect(undefined, dispatch)
                        }
                        setDoubleAuthDataCode(undefined)
                        setDoubleAuthDataDate(formatDateToYmdHs(new Date(), true))

                        setShowInstances(true)
                    
                    }else if(data?.error){
                        if(data.error.code == 'IZIFLO_CONNECT_NOT_ALLOWED'){
                            Alert.alert(locale._template.connection_not_allowed,locale._template.iziflo_connect_not_allowed_message) 
                            console.log("data.error (iziflo not allowed) : " +JSON.stringify(data))
                        }else if(data.error.code == 'ERROR_ON_CODE' && data.error.data?.errorCode){
                            handleErrorOnCode(data)
                        }else{
                            //TODO failed
                            Alert.alert(locale._template.connection_not_allowed, locale._template.connection_not_allowed_message) 
                            console.log("data.error4 : " +JSON.stringify(data))
                        }
                    }else{
                        //TODO error
                            Alert.alert(locale._template.connection_not_allowed,locale._template.connection_retry_message) 
                        console.log("data unknown : " +JSON.stringify(data))
                    } 
                    setLoading(false)
                }).catch(()=>setLoading(false))
        }else{
            //TODO no server 
                console.log("no server ")
        }
    }


    function _disconnect(isFromInstanceChoise = false){
        if(!isFromInstanceChoise)
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
                        _resetUser()
                        setServer(undefined)
                        setPassword(undefined)
                        setShowInstances(false)
                        navigation.navigate("Login")
                    }
                }]
            })
                
        _resetUser()
        setServer(undefined)
        setPassword(undefined)
        setShowInstances(false)
        
    }

    function _connectToGoogle(){
        msal.signOut();
    }

    async function _connectToOffice(){
        if(msal.isInit()){
        const params = {
            scopes: ["User.Read"],
          };
          if(await msal.isSignedIn()) await msal.signOut()
          const result = await msal.signIn(params)
          .catch((e)=>{console.log("msal : "+ JSON.stringify(e, null, 2)); return e});
          
          if(result && result.idToken){
              let externalToken = {
                    email:result.account.username,
                    token : result.accessToken,
                    state : TOKEN_STATE.VALID,
                    tokenType:TOKEN_TYPE.MICROSOFT
              }
              let usr={
                  email:externalToken.email,
                  token:externalToken

              }

              setUser(usr)
              setShowInstances(true)
            
            }
        }
    }

    const _gotoMain = () => {
        navigation.navigate('Main')
    }

    const handleErrorOnCode = (data) => {
        doubleAuthModal?.current?.resetLoaders()
        setDoubleAuthDataCode(data.error?.data?.errorCode)
    }



    /*---------------------------
    -
    -         Callbacks
    -
    ----------------------------*/
    const _onInstanceChoosen= ( server,settings )=>{
        if(user && user.token){
            let usr = {email:user.email, token:user.token, server:server,settings, double_auth_date:doubleAuthDate}
            if(storedUser && (storedUser.server?.id != server?.id || storedUser.server?.instance?.id != server?.instance?.id)){
                disconnect(undefined, dispatch)
            }
            _storeUser(usr, true)
        }
    }

    const _onPasswordForgotten = ()=> navigation.navigate('ForgotPassword')


    const _closeAll = (omit= {server:false, server2:false, instances:false})=>{
        if(!!!omit?.keyboard) Keyboard.dismiss()
        setDropdownOpen({...{server:false, server2:false, instances:false}, ...omit})
    }

    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    function _displayContent(){
        if(!focused){
            return undefined
        }
        else if(loading ){
            return _displayLoading()
        }else if (! _isLoggedIn()){
            if(user?.token?.tokenType 
                && (server || ( user.token.tokenType != TOKEN_TYPE.IZIFLO)) 
                && showInstances){
                return _displayInstanceChoice()
            }else{
                return _displayLogin()
            }
        }else{
            return _displayLoggedIn()   
        }
    }
    
    function _displayLogin(){
        return  (
            <View style={loginStyles.login_container}>
                {/* Bottom part*/ }
                <View style={loginStyles.top_container_reverse}>
                    <Image style={IziDimensions.getDimension(window,loginStyles.logo)} source={require(("../res/logo-iziflo.png"))}/> 
                    <IziTextInput style={{marginBottom:12}} title={locale._template.email_input.title} keyboardType='email-address' placeholder={locale._template.email_input.placeholder} 
                    autoCapitalize='none' autoCorrect={false}
                    value={email}  onChangeText={(value) => {setEmail(value); setServer(undefined)}}/>
                    <IziTextInput style={{}} title={locale._template.password_input.title} keyboardType='default' autoCapitalize='none' placeholder={locale._template.password_input.placeholder} secureTextEntry={true}
                    value={password}  onChangeText={(value) => {setPassword(value)}} textContentType='password'/>
                    <IziServerDropDown
                        style={{marginTop:12}} 
                        email={email} 
                        value={server}
                        setValue={(item)=>{setServer(item)}}
                        />
                    <Button 
                        style={IziDimensions.getDimension(window, loginStyles.connect_button)} 
                        title={locale._template.connect_upper} 
                        iziStyle={_getConnectButtonStyle()}
                        loading={loading}
                        onPress={() => _connect() }/>
                    <View style={loginStyles.forgotten_pass_outer_container}>
                        <TouchableOpacity style={IziDimensions.getDimension(window, loginStyles.forgotten_pass_container)} onPress={() =>_onPasswordForgotten()}>
                            <Text style={loginStyles.forgotten_pass} >{locale._template.forgotten_pass}</Text>
                        </TouchableOpacity>
                    </View>

                        

                    
                    
                </View>
                <View style={IziDimensions.getDimension(window,loginStyles.bottom_container)}>
                    <View style={IziDimensions.getDimension(window,loginStyles.buttons_container)}>
                        <View style={IziDimensions.getDimension(window, loginStyles.connect_container_inter_margin)}>
                            <View style={loginStyles.connect_with_line}/>
                            <Text style={loginStyles.connect_with}>{locale._template.or_connect_with}</Text>
                        </View>
                        <Button style={{...IziDimensions.getDimension(window, loginStyles.connect_container_inter_margin), display:'none'}} imgSrc={require(("../res/logo-google.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToGoogle}/>
                        <Button style={IziDimensions.getDimension(window, loginStyles.connect_container_inter_margin)} imgSrc={require(("../res/logo-office.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToOffice}/>
                    </View>
                    <Text style={loginStyles.legal_text}>{locale._template.legal_text}</Text>
                </View>
                    
            </View>
        )
    }

    function _displayInstanceChoice(){
        if(showInstances)
            return (
                <View style={{...loginStyles.login_container, padding:40}} >
                        <InstanceChoice 
                            user={user}
                            password={password}
                            onInstanceChoosen={_onInstanceChoosen}
                            serverOpen={dropdownOpen.server2} 
                            setServerOpen={(value)=>setDropdownOpen({server2:value})} 
                            instancesOpen={dropdownOpen.instances} 
                            setInstancesOpen={(value)=>setDropdownOpen({instances:value})} 
                            onOpen={_closeAll}
                        onLogout={() => _disconnect(true)}/>
                </View>
        )
    }

    function _displayLoggedIn(){
        const lockTime = Config.FLAVOR =='D' ? 10000 : 3*60*1000
        return (
            <View style={{flex:1, width:"100%"}}>
            <PINCode 
                status={user?.pin ? 'enter' : 'choose'}
                storedPin={user?.pin}
                storePin={(pin)=>_setPin(pin)}
                finishProcess={()=> _gotoMain()}
                onClickButtonLockedPage={()=> _disconnect()}
                timeLocked={lockTime}
                //text
                textButtonLockedPage={locale._template.disconnect}
                titleChoose={locale._template.pincode.title_choose}
                titleConfirm={locale._template.pincode.title_confirm}
                titleEnter={locale._template.pincode.title_enter}
                titleConfirmFailed={locale._template.pincode.title_confirm_failed}
                titleAttemptFailed={locale._template.pincode.title_attempt_failed}
                textTitleLockedPage={locale._template.pincode.text_title_locked_page}
                textSubDescriptionLockedPage={locale._template.pincode.text_sub_description_locked_page}
                textDescriptionLockedPage={locale.formatString(locale._template.pincode.text_description_locked_page, {timeLocked:(lockTime/60000)})}
                subtitleError={locale._template.pincode.subtitle_error}
                subtitleChoose={locale._template.pincode.subtitle_choose}
                touchIDTitle={locale._template.pincode.touch_id_title}
                textCancelButtonTouchID={locale._template.pincode.touch_id_cancel}
                touchIDSentence={locale._template.pincode.touch_id_sentence}
                //style
                stylePinCodeButtonNumber={colors.iziflo_blue}
                stylePinCodeColorSubtitle={colors.iziflo_blue}
                stylePinCodeColorTitle={colors.iziflo_blue}
                colorPassword={colors.iziflo_blue}
                colorPasswordEmpty={colors.iziflo_blue}
                stylePinCodeDeleteButtonSize={40}
                stylePinCodeDeleteButtonText={{display:'none'}}
                stylePinCodeColumnDeleteButton={{ height:'100%'}}
            />
            <Button style={{...loginStyles.button, position:"absolute", width:160, top:5, right:10,height:35}} title={locale._template.disconnect_upper} iziStyle={IziButtonStyle.orange} onPress={() => _disconnect()}/>
            </View>
        )
    }

    function _displayLoading(){
        if(loading){
            return (
                <View style={loginStyles.login_container}>
                  <Loader/>
                </View>
              )
        }else return undefined
    }


    const _getConnectButtonStyle = () => {
        return (
            !isEmpty(email) 
            && isEmailValid(email)
            && !isEmpty(password)
            && server) 
            ?  IziButtonStyle.green 
            : IziButtonStyle.disabled
    }

    /*---------------------------
    -
    -         Return
    -
    ----------------------------*/
    return(
            <TouchableWithoutFeedback style={{height:"100%", width:"100%"}} onPress={()=>{_closeAll()}}>
                <KeyboardAvoidingView style={{height:'100%'}} behavior=''>
                    <View style={{flex:1, backgroundColor:'white'}}>
                        {_displayContent()}
                        <DoubleAuthModal 
                        ref={doubleAuthModal} 
                        errorCode={doubleAuthCode} 
                        email={email}
                        resetError={() => setDoubleAuthDataCode(undefined)}
                        onSendAgain ={( code) =>_connect(code === undefined,code)}/>
                    </View> 
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
    )
}

const loginStyles = {
    login_container:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'stretch',
        backgroundColor:'white'
        
    },
    top_container_reverse:{
        flex:1,
        width:'100%',
        justifyContent:'center',
        alignItems:'stretch',
        paddingEnd:40,
        paddingStart:40,
        alignSelf:'center',
        flexDirection:'column',
        maxWidth:500
        
    },
    bottom_container:{
        qdef:{
            height:160,
            backgroundColor: colors.iziflo_back_blue,
            justifyContent:'center',
            alignItems:'center',
            paddingEnd:40,
            paddingStart:40,
        },
        q420sw:{
            height:250
        }
    },
    buttons_container:{
        qdef:{
            flex:1,
            width:250,
            justifyContent:'center',
            alignItems:'stretch',
            paddingTop:20,
            paddingBottom:0,
        },
        q420sw:{
            paddingTop:40,
            paddingBottom:40,
        }
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
    forgotten_pass_container:{
        qdef:{
            marginTop:0,
            marginBottom:0,
            alignSelf:'center',
            alignItems:'stretch',
        },
        q420sw:{
            marginTop:8,
            marginBottom:8,
            alignSelf:'center',
            alignItems:'stretch',
        }
    },
    forgotten_pass_outer_container:{
        alignSelf:'center',
    },
    forgotten_pass:{
        margin:12,
        color:colors.iziflo_blue,
        fontSize:14,
        backgroundColor:'transparent'
    },
    connect_button:{
        qdef:{
            alignSelf:'center',
            width:250,
            marginTop:0,
        },
        q420sw:{
            marginTop:10,
        }
    },
    connect_with:{
        flex:0,
        fontSize:14,
         color:colors.iziflo_blue,
         textAlign:'center',
         alignSelf:'center',
         backgroundColor:colors.iziflo_back_blue,
         paddingStart:6,
         paddingEnd:6,
    },
    connect_with_line:{
        position:'relative', 
        top:'55%', 
        backgroundColor:colors.iziflo_blue, 
        height:1
    },
    legal_text:{
        fontSize:10,
         color:colors.iziflo_blue,
         textAlign:'center',
         marginBottom:10,
    },
    connect_container_inter_margin:{
        qdef:{
            marginBottom:8
        },
        marginBottom:20
    }
}

export default LoginScene
