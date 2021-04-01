import React ,{useState, useEffect} from 'react'
import {
    View, SafeAreaView, Text,Image, StyleSheet, KeyboardAvoidingView, Platform, Alert,BackHandler
} from 'react-native'
import { useIsFocused, useFocusEffect} from '@react-navigation/native' 
import { StackNavigationProp } from '@react-navigation/stack';
import Button ,{IziButtonStyle}from '../Components/IziButton'
import InstanceChoice from '../Components/InstanceChoice'
import Loader from '../Components/IziLoader'
import IziTextInput from '../Components/IziTextInput'
import IziServerDropDown from '../Components/IziServerDropDown'
import {requestInstances,requestToken, ProdServer} from '../API/LoginApi'
import SInfo from 'react-native-sensitive-info';
import {__SInfoConfig} from '../Tools/Prefs';
import {getStoredUser, deleteStoredUser, storeUser, TOKEN_STATE} from '../Tools/TokenTools';
import {isEmpty, isEmailValid} from '../Tools/StringTools';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import PublicClientApplication, { MSALConfiguration,MSALInteractiveParams,MSALResult} from 'react-native-msal';
import Config from "react-native-config";

import Styles, { colors } from '../Styles/Styles'
import locale from '../../Locales/locales'
//types
import {User, Token, ServerType, InstanceType, CompanyType} from "../Types/LoginTypes"
import { TouchableOpacity } from 'react-native-gesture-handler';
import PINCode from '@haskkor/react-native-pincode'


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
    const [server, setServer] = useState<ServerType | undefined>(Config.FLAVOR =='P' ? ProdServer : undefined)
    const [instances, setInstances] = useState<InstanceType[] | undefined>(undefined)
    const [externalToken, setExternalToken] = useState<Token | undefined>(undefined)
    var pca : PublicClientApplication // MSAL client
    //data
    const [user, setUser] = useState<User | undefined>(undefined)

    //effects
    useEffect(()=>{
        //GoogleSignin.configure()
        _initOffice()
    }, [])
    useEffect(()=>{
        _loadUser()
    }, [focused])

    



    /*---------------------------
    -
    -         inits
    -
    ----------------------------*/
    const _initOffice = async ()=>{
        const config  : MSALConfiguration = {
            auth: {
              clientId: 'a8c78f9a-1934-4f4c-8115-e684dc693285',
              // authority: 'default-authority',
            },
          };

        // Option 2: Skips init, so you can call it yourself and handle errors
        pca = new PublicClientApplication(config, false);
        try {
            await pca.init();
        } catch (error) {
            console.error('Problem in configuration/setup MSAL:', error);
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

    // create a function that saves your data asyncronously
    const _resetUser= ( shouldSetUser = true)=>{
        try{
            deleteStoredUser();    
            if(shouldSetUser)
                setUser(undefined)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
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
            setLoading(true)
            let data : User = await getStoredUser()
            console.log("user : "+JSON.stringify(data))
            setUser(data)
            if(!user) {
                await setServer(undefined)
                await setInstances(undefined)
            }
            setLoading(false)
          } catch (error) {
            console.log("Something went wrong", error);
          }
      
    }

    const _setPin = (pin?:string)=>{
        console.log("setPin")
        if(user){
            user.pin= pin
            _storeUser(user, false)
        }
    }

    const _isLoggedIn = () => {
        return user != undefined && user.token != null &&  user.server && user.server.instance
    }
    /*---------------------------
    -
    -         Connection
    -
    ----------------------------*/

    const _askForInstancesWithEmpty = ()=>{
        _askForInstances();
    }
    function _askForInstances(externalToken?:Token){
        setLoading(true);
        if(externalToken){
            setExternalToken(externalToken)
            //TODO load instance from token
        }else{
            if(!server || !isEmailValid(email) || !password) {
                //TODO error message : missing data
            }else{
                requestInstances(server, email, password)
                    .then((data)=>{
                        data.data.forEach((instance : InstanceType) => {
                            instance.value=instance.id_instance,
                            instance.label=instance.instance_code + ' - ' + instance.instance_name
                            console.log(instance)
                        });

                        setInstances(data.data);
                    })
            }

        }
        setLoading(false)
    }
    function _connect(instance : InstanceType){
        setLoading(true);
        if(instance){
            if(externalToken){
                //TODO connect to instance with external
            }else{
                if(!server || !isEmailValid(email) || !password) {
                    //TODO error message : missing data
                }else{
                    //TODO connect to instance
                    //save
                    requestToken(server, email, password, instance.id_instance)
                        .then((data)=>{
                            if(data.success){
                                server.instance = instance
                                let usr  : User = {
                                    email : email!!, 
                                    token : {token:data.success.token, state:TOKEN_STATE.VALID, expirationDate:data.success.access_token_expiration_date, email:email!!}, 
                                    server:server
                                }
                                _storeUser(usr)
                                setUser(usr)
                            
                            }else if(data.error){
                                //TODO failed
                            }else{
                                //TODO error
                            }
                                
                        })
                }

            }
        }
        setLoading(false)
    
    }

    function _disconnect(){
        console.log("logout");
        _resetUser()
        setServer(undefined)
        setInstances(undefined)
        setPassword(undefined)
        setExternalToken(undefined)
        
    }

    function _connectToGoogle(){
    }

    const  _connectToOffice = async () => {
        if(pca){
        const params: MSALInteractiveParams = {
            scopes: ["User.Read"],
          };
          console.log(pca)
          const result: MSALResult = await pca.acquireToken(params);
          if(result && result.idToken){
              let externalToken :Token = {
                    email:result.account.username,
                    token : result.accessToken,
                    state : TOKEN_STATE.VALID
              }
              _askForInstances(externalToken);
            
            }
        }
    }


    /*---------------------------
    -
    -         Callbacks
    -
    ----------------------------*/
    const _onInstanceChoosen= (instance : InstanceType, company? : CompanyType)=>{
        _connect(instance)
    }

    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    function _displayContent(){
        console.log("isLoggedIn : "+JSON.stringify(server))
        if(loading){
            return _displayLoading()
        }else if (! _isLoggedIn()){
            if(server && instances){
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
                <Image style={loginStyles.logo} source={require(("../res/logo-iziflo-transparent.png"))}/>
                    <IziTextInput style={{marginBottom:12}} title={locale._template.email_input.title} keyboardType='email-address' placeholder={locale._template.email_input.placeholder} 
                    autoCapitalize='none' autoCorrect={false}
                    value={email}  onChangeText={(value:string) => {setEmail(value)}}/>
                    <IziTextInput style={{}} title={locale._template.password_input.title} keyboardType='default' placeholder={locale._template.password_input.placeholder} secureTextEntry={true}
                    value={password}  onChangeText={(value:string) => {setPassword(value)}} textContentType='password'/>

                
                    {// Only if not in prod
                        _displayServerPicker()
                    }
                    <Button style={loginStyles.connect_button} title={locale._template.connect} iziStyle={_getConnectButtonStyle()} onPress={_askForInstancesWithEmpty }/>
                    <TouchableOpacity style={loginStyles.forgotten_pass_container}>
                        <Text style={loginStyles.forgotten_pass}>{locale._template.forgotten_pass}</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={loginStyles.bottom_container}>
                    <View style={loginStyles.buttons_container}>
                        <View style={{marginBottom:20}}>
                            <View style={loginStyles.connect_with_line}/>
                            <Text style={loginStyles.connect_with}>Ou connectez vous avec</Text>
                        </View>
                        <Button style={{marginBottom:20}} title={locale._template.google} iziStyle={IziButtonStyle.connection} onPress={_connectToGoogle}/>
                        <Button style={{}} title={locale._template.office_365} iziStyle={IziButtonStyle.connection} onPress={_connectToOffice}/>
                    </View>
                    <Text style={loginStyles.legal_text}>{locale._template.legal_text}</Text>
                </View>
            </KeyboardAvoidingView>
        )
    }

    function _displayInstanceChoice(){
        return (
            <View style={loginStyles.login_container} >
                <View style={loginStyles.top_container}>
                    <InstanceChoice instances={instances!!}  onInstanceChoosen={_onInstanceChoosen} onLogout={_disconnect}/>
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
                finishProcess={()=> navigation.navigate('Main')}
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

    const _displayServerPicker = ()=>{
        if(Config.FLAVOR != 'P'){
            return (
                <IziServerDropDown style={{marginTop:12}} email={email} onChangeItem={(item:ServerType)=>{setServer(item)}}/>
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
       resizeMode:'contain'
    },
    forgotten_pass_container:{
        paddingTop:20,
        paddingBottom:20,
         alignItems:'center'        
    },
    forgotten_pass:{
         color:colors.iziflo_blue,
         fontSize:14,
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
