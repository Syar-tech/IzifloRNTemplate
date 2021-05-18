import React ,{useState, useEffect} from 'react'
import {
    View, SafeAreaView, Text,Image, StyleSheet, KeyboardAvoidingView, Platform, Alert,BackHandler,TouchableOpacity
} from 'react-native'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import InstanceChoice from '../Components/InstanceChoice'
import Loader from '../Components/IziLoader'
import IziTextInput from '../Components/IziTextInput'
import IziServerDropDown from '../Components/IziServerDropDown'
//libs
import SInfo from 'react-native-sensitive-info';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useIsFocused, useFocusEffect} from '@react-navigation/native' 
import PublicClientApplication, { MSALConfiguration,MSALInteractiveParams,MSALResult} from 'react-native-msal';
import Config from "react-native-config";

import Styles, { colors } from '../Styles/Styles'
import locale from '../../Locales/locales'

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
import DropDownPicker from 'react-native-dropdown-picker'
import { getBundleId } from 'react-native-device-info'
import { resetInternalStates } from '@haskkor/react-native-pincode/dist/src/utils'


type RootStackParamList = {
    Main: undefined;
    Login: undefined;
  };
type Props = {
    navigation : StackNavigationProp<RootStackParamList, 'Login'>
}
const LoginScene = ({navigation} : Props) => {

    /*---------------------------
    -
    -         State
    -
    ----------------------------*/
    //local
    const focused = useIsFocused();
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [server, setServer] = useState<ServerType | undefined>(undefined)
    const [instances, setInstances] = useState<InstanceType[] | undefined>(undefined)
    const [showInstances, setShowInstances] = useState(false)
    const [msal, setMsal] = useState(new MSALConnect())
    
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
                console.log("promise")
                promise = requestToken(server, email, password)
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
                console.log("data.error : " +JSON.stringify(data))
                    }else{
                        //TODO error
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

    const _onPassordForgotten = ()=>{
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
            <KeyboardAvoidingView style={loginStyles.login_container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
            <View style={loginStyles.top_container}>
                <Image style={loginStyles.logo} source={require(("../res/logo-iziflo.png"))}/>
                    <IziTextInput style={{marginBottom:12}} title={locale._template.email_input.title} keyboardType='email-address' placeholder={locale._template.email_input.placeholder} 
                    autoCapitalize='none' autoCorrect={false}
                    value={email}  onChangeText={(value:string) => {setEmail(value); setServer(undefined)}}/>
                    <IziTextInput style={{}} title={locale._template.password_input.title} keyboardType='default' placeholder={locale._template.password_input.placeholder} secureTextEntry={true}
                    value={password}  onChangeText={(value:string) => {setPassword(value)}} textContentType='password'/>
                    <IziServerDropDown 
                        style={{marginTop:12}} 
                        zIndex={1000} 
                        email={email} 
                        value={server} 
                        setValue={(item:ServerType)=>{setServer(item)}}
                        />
                    
                    <Button 
                        style={loginStyles.connect_button} 
                        title={locale._template.connect} 
                        iziStyle={_getConnectButtonStyle()} 
                        onPress={_connect } 
                        zIndex={1}/>
                    <View style={loginStyles.forgotten_pass_outer_container}>
                        <TouchableOpacity style={loginStyles.forgotten_pass_container} onPress={() =>_onPassordForgotten()}>
                            <Text style={loginStyles.forgotten_pass} >{locale._template.forgotten_pass}</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                
                <View style={loginStyles.bottom_container}>
                    <View style={loginStyles.buttons_container}>
                        <View style={{marginBottom:20}}>
                            <View style={loginStyles.connect_with_line}/>
                            <Text style={loginStyles.connect_with}>Ou connectez vous avec</Text>
                        </View>
                        <Button style={{marginBottom:20}} imgSrc={require(("../res/logo-google.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToGoogle}/>
                        <Button style={{}} imgSrc={require(("../res/logo-office.png"))} iziStyle={IziButtonStyle.connection} onPress={_connectToOffice}/>
                    </View>
                    <Text style={loginStyles.legal_text}>{locale._template.legal_text}</Text>
                </View>
            </KeyboardAvoidingView>
        )
    }

    function _displayInstanceChoice(){
        console.log("show instance : "+user)
        if(showInstances)
            return (
                <View style={loginStyles.login_container} >
                    <View style={loginStyles.top_container}>
                        <InstanceChoice 
                            user={user!!}
                            password={password}
                            onInstanceChoosen={_onInstanceChoosen} 
                        onLogout={_disconnect}/>
                    </View>
                </View>
        )
    }

    function _displayLoggedIn(){
        return (
            <PINCode 
                status={user?.pin ? 'enter' : 'choose'}
                storedPin={user?.pin}
                storePin={(pin?:string)=>_setPin(pin)}
                finishProcess={()=> _gotoMain()}
                onClickButtonLockedPage={()=> _disconnect()}
                textButtonLockedPage={locale._template.disconnect}
                timeLocked={Config.FLAVOR =='D' ? 10000 : 3*60*1000}
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
        <SafeAreaView style={{flex:1}}>
            {_displayContent()}
        </SafeAreaView>
    )
}

const loginStyles = StyleSheet.create({
    login_container:{
        flex:1,
        justifyContent:'center',
        alignItems:'stretch',
        backgroundColor:'white'
        
    },
    top_container:{
        flex:1,
        justifyContent:'center',
        alignItems:'stretch',
        paddingEnd:40,
        paddingStart:40,
        
    },
    bottom_container:{
        height:250,
        backgroundColor: colors.iziflo_back_blue,
        justifyContent:'center',
        alignItems:'center',
        paddingEnd:40,
        paddingStart:40,
        
    },
    buttons_container:{
        flex:0,
        width:250,
        justifyContent:'center',
        alignItems:'stretch',
        paddingTop:40,
        paddingBottom:40,
        
    },
    logo:{
       height:200 ,
       width:300,
       resizeMode:'contain',
       alignSelf:'center',
       
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
        alignSelf:'center',
        width:250,
        marginTop:10,
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
})


export default LoginScene
