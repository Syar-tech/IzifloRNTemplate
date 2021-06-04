import React ,{useState, useEffect, useReducer} from 'react'
import {
    View, SafeAreaView, Text,Image, StyleSheet, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Alert,BackHandler,TouchableOpacity, Keyboard
} from 'react-native'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import InstanceChoice from '../Components/InstanceChoice'
import Loader from '../Components/IziLoader'
import IziTextInput from '../Components/IziTextInput'
import IziServerDropDown from '../Components/IziServerDropDown'
//libs
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useIsFocused} from '@react-navigation/native' 
import { useWindowDimensions } from 'react-native'
import  { MSALInteractiveParams,MSALResult} from 'react-native-msal';
import Config from "react-native-config";

import { colors } from '../Styles/Styles'
import locale from '../Locales/locales'

//Tools
import {requestToken} from '../API/LoginApi'
import {__SInfoConfig} from '../Tools/Prefs';
import {getStoredUser, deleteStoredUser, storeUser, TOKEN_STATE} from '../Tools/TokenTools';
import {isEmpty, isEmailValid} from '../Tools/StringTools';
//types
import { StackNavigationProp } from '@react-navigation/stack';
import {User, Token, ServerType, InstanceType, TOKEN_TYPE} from "../Types/LoginTypes"
import PINCode from '@haskkor/react-native-pincode'
import MSALConnect from '../API/MSALConnectApi'
import {IziDimensions} from '../Tools/Dimensions'


type RootStackParamList = {
    Main: undefined;
    Login: undefined;
  };
type Props = {
    navigation : StackNavigationProp<RootStackParamList, 'Login'>
}

type DropdownOpenType = {
    server:boolean
    server2:boolean
    isntances:boolean
}
const LoginScene = ({navigation} : Props) => {

    /*---------------------------
    -
    -         State
    -
    ----------------------------*/
    //local
    const window = useWindowDimensions()
    const focused = useIsFocused();
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [server, setServer] = useState<ServerType | undefined>(undefined)
    const [instances, setInstances] = useState<InstanceType[] | undefined>(undefined)
    const [showInstances, setShowInstances] = useState(false)
    const [msal] = useState(new MSALConnect())
    const [dropdownOpen, setDropdownOpen] = useReducer((state:DropdownOpenType, action)=>{return {...state, ...action}},{server:false, server2:false, instances:false})
    
    //data
    const [user, setUser] = useState<User | undefined>(undefined)


    useEffect(()=>{
        _initOffice()
    }, [])
    useEffect(()=>{
        if(focused)
            _loadUser()
        else setUser(undefined)
    }, [focused])

    



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

    /*---------------------------
    -
    -         back handler
    -
    ----------------------------*/

    useEffect(() => {
        const backAction = () => {
          Alert.alert("Hold on!", "Are you sure you want to go back?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
          ],
          {cancelable:true});
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
      }, []);

    /*---------------------------
    -
    -         Storage
    -
    ----------------------------*/

    const _resetUser= ( shouldSetUser = true)=>{
        try{
            deleteStoredUser();    
            if(shouldSetUser)
                setUser(undefined)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
    // create a function that saves your data asyncronously
    const _storeUser = async (user:User, shouldSetUser = true) => {
        try{
            await storeUser(JSON.stringify(user));    
            if(shouldSetUser)
                setUser(user)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
    

    const _loadUser = async ()=>{
        try {

            await setLoading(true)
            let data : User = await getStoredUser()
            await setUser(data)
            if(!user) {
                await setServer(undefined)
                await setInstances(undefined)
                setLoading(false)
                return undefined
            }
          } catch (error) {
            console.log("Something went wrong", error);
            setLoading(false)
          }
      
    }

    const _setPin = (pin?:string)=>{
        console.log("setPin")
        if(user){
            console.log("setPin loading true")
            setLoading(true)
            user.pin = pin
            _storeUser(user, false)
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

    

    function _connect(){

        console.log("connect loading true")
        setLoading(true);
        if(server){
            let promise  = null;
            
            if(!isEmailValid(email) || !password) {
                //TODO error message : missing data
            }else{
                //connect to instance
                //save
                if(email =="demo@syartec.com"){
                    _connectToDemo();
                }else{
                    console.log("promise")
                    promise = requestToken(server, email, password)
                }
            }

            if(promise)
                promise.then((data:any)=>{
                    if(data?.success){
                        let usr  : User = {
                            email : email!!, 
                            token : {
                                state:TOKEN_STATE.VALID,
                                tokenType:TOKEN_TYPE.IZIFLO,
                                token:data.success.access_token ,
                                expirationDate:data.success.access_token_expiration_date, 
                                refreshToken:data.success.refresh_token ,
                                refreshExpirationDate:data.success.refresh_token_expiration_date, 
                                email:email!!}, 
                            server:server
                        }
                        setUser(usr)
                        setShowInstances(true)
                        console.log("showIntance")
                    
                    }else if(data?.error){
                        //TODO failed
                        Alert.alert("Impossible de se connecter. Veuillez vérifier vos identifiants") 
                        console.log("data.error : " +JSON.stringify(data))
                    }else{
                        //TODO error
                        Alert.alert("Impossible de se connecter. Veuillez réessayer") 
                        console.log("data unknown : " +JSON.stringify(data))
                    }
                        
                })
        }else{
            //TODO no server 
                console.log("no server ")
        }
        console.log("connect loading false")
        setLoading(false)
    }

    const _connectToDemo = () => {
        if(email == "demo@syartec.com" && password == "demo"){
            let usr  : User = {
                email : email!!, 
                token : {
                    state:TOKEN_STATE.VALID,
                    tokenType:TOKEN_TYPE.DEMO,
                    token:"abc",
                    email:email!!}, 
                server:server
            }
            setUser(usr);
            navigation.navigate('Demo')
        }
    }

    function _disconnect(){
        console.log("logout");
        _resetUser()
        setServer(undefined)
        setInstances(undefined)
        setPassword(undefined)
        setShowInstances(false)
        
    }

    function _connectToGoogle(){
    }

    async function _connectToOffice(){
        if(msal.isInit()){
        const params: MSALInteractiveParams = {
            scopes: ["User.Read"],
          };
          const result: MSALResult = await msal.signIn(params)
          .catch((e)=>{console.log("msal : "+ JSON.stringify(e, null, 2)); return e});
          
          if(result && result.idToken){
              let externalToken :Token = {
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

              console.log("connect office : "+JSON.stringify(usr));
            
            }
        }
    }

    const _gotoMain = () => {
        navigation.navigate('Main')
    }


    /*---------------------------
    -
    -         Callbacks
    -
    ----------------------------*/
    const _onInstanceChoosen= ( server : ServerType)=>{
        if(user && user.token){
            let usr = {email:user.email, token:user.token, server:server}
            _storeUser(usr, true)
        }
    }

    const _onPasswordForgotten = ()=>{
    }

    const _closeAll = (omit= {server:false, server2:false, instances:false})=>{
        if(!!omit?.keyboard) Keyboard.dismiss()
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
            <View style={IziDimensions.getDimension(window,loginStyles.bottom_container)}>
                <View style={IziDimensions.getDimension(window,loginStyles.buttons_container)}>
                    <View style={{marginBottom:20}}>
                        <View style={loginStyles.connect_with_line}/>
                        <Text style={loginStyles.connect_with}>Ou connectez vous avec</Text>
                    </View>
                    <Button style={{marginBottom:20}} imgSrc={require(("../res/logo-google.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToGoogle}/>
                    <Button style={{}} imgSrc={require(("../res/logo-office.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToOffice}/>
                </View>
                <Text style={loginStyles.legal_text}>{locale._template.legal_text}</Text>
            </View>
            <View style={loginStyles.top_container_reverse}>
                <View style={loginStyles.forgotten_pass_outer_container}>
                    <TouchableOpacity style={loginStyles.forgotten_pass_container} onPress={() =>_onPasswordForgotten()}>
                        <Text style={loginStyles.forgotten_pass} >{locale._template.forgotten_pass}</Text>
                    </TouchableOpacity>
                </View>
                <Button 
                    style={IziDimensions.getDimension(window, loginStyles.connect_button)} 
                    title={locale._template.connect} 
                    iziStyle={_getConnectButtonStyle()}
                    onPress={_connect }/>

                <IziServerDropDown 
                    style={{marginTop:12}} 
                    open={dropdownOpen.server}
                    setOpen={(value:Boolean)=>{setDropdownOpen({server:value})}}
                    onOpen={() => _closeAll({server:true})}
                    email={email} 
                    value={server} 
                    zIndex={1000}
                    setValue={(item:ServerType)=>{setServer(item)}}
                    />
                    
                <IziTextInput style={{}} title={locale._template.password_input.title} keyboardType='default' placeholder={locale._template.password_input.placeholder} secureTextEntry={true}
                value={password}  onChangeText={(value:string) => {setPassword(value)}} textContentType='password'/>

                <IziTextInput style={{marginBottom:12}} title={locale._template.email_input.title} keyboardType='email-address' placeholder={locale._template.email_input.placeholder} 
                autoCapitalize='none' autoCorrect={false}
                value={email}  onChangeText={(value:string) => {setEmail(value); setServer(undefined)}}/>
                   
                <Image style={IziDimensions.getDimension(window,loginStyles.logo)} source={require(("../res/logo-iziflo.png"))}/> 
                 
                    
                </View>
                
            </View>
        )
    }

    function _displayInstanceChoice(){
        if(showInstances)
            return (
                <View style={{...loginStyles.login_container, padding:40}} >
                        <InstanceChoice 
                            user={user!!}
                            password={password}
                            onInstanceChoosen={_onInstanceChoosen}
                            serverOpen={dropdownOpen.server2} 
                            setServerOpen={(value)=>setDropdownOpen({server2:value})} 
                            instancesOpen={dropdownOpen.instances} 
                            setInstancesOpen={(value)=>setDropdownOpen({instances:value})} 
                            onOpen={_closeAll}
                        onLogout={_disconnect}/>
                </View>
        )
    }

    function _displayLoggedIn(){
        const lockTime = Config.FLAVOR =='D' ? 10000 : 3*60*1000
        return (
            <PINCode 
            status={user?.pin ? 'enter' : 'choose'}
            storedPin={user?.pin}
            storePin={(pin?:string)=>_setPin(pin)}
            finishProcess={()=> _gotoMain()}
            onClickButtonLockedPage={()=> _disconnect()}
            timeLocked={lockTime}
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
            />
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
        <TouchableWithoutFeedback style={{flex:1}} onPress={()=>{_closeAll()}}>
            <View style={{flex:1}}>
                {_displayContent()}
            </View>
        </TouchableWithoutFeedback>
    )
}

const dimensions = {
    qdef:{
        bottomHeight:200
    },
    q450sw:{
        bottomHeight:200
    },
    q600sw:{},
    q720sw:{},
    qdef_land:{

    },
    q450sw_land:{

    },
    q600sw_land:{},
    q720sw_land:{},

   
}

const loginStyles = {
    login_container:{
        flex:1,
        flexDirection:'column-reverse',
        justifyContent:'center',
        alignItems:'stretch',
        backgroundColor:'white'
        
    },
    top_container_reverse:{
        flex:1,
        justifyContent:'center',
        alignItems:'stretch',
        paddingEnd:40,
        paddingStart:40,
        flexDirection:'column-reverse'
        
    },
    bottom_container:{
        qdef:{
            height:200,
            backgroundColor: colors.iziflo_back_blue,
            justifyContent:'center',
            alignItems:'center',
            paddingEnd:40,
            paddingStart:40,
        },
        q450sw:{
            height:250
        }
    },
    buttons_container:{
        qdef:{
            flex:0,
            width:250,
            justifyContent:'center',
            alignItems:'stretch',
            paddingTop:20,
            paddingBottom:0,
        },
        q450sw:{
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
        q450sw:{
            height:200 ,
        }
       
    },
    forgotten_pass_container:{
        marginTop:8,
        marginBottom:8,
        alignSelf:'center',
        alignItems:'stretch',
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
        q450sw:{
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
         marginTop:20,
    },
}


export default LoginScene
