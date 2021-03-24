import React ,{useState, useEffect} from 'react'
import {View, SafeAreaView, Text, StyleSheet,ActivityIndicator, ScrollView} from 'react-native'
import Button ,{IziButtonStyle}from '../Components/IziButton'
import Loader from '../Components/IziLoader'
import IziTextInput from '../Components/IziTextInput'
import locales from '../../Locales/locales'
import {attemptLogin} from '../API/LoginApi'
import SInfo from 'react-native-sensitive-info';
import {__SInfoConfig} from '../Tools/Prefs';
import {getToken, TOKEN_STATE} from '../Tools/TokenTools';
import {isEmpty} from '../Tools/StringTools';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import PublicClientApplication, { MSALConfiguration,MSALInteractiveParams,MSALResult} from 'react-native-msal';

//types
import {User} from "../Types/LoginTypes"



const LoginScene = () => {

    
    /*---------------------------
    -
    -         State
    -
    ----------------------------*/

    //local
    const [email, setEmail] = useState<string | undefined>(undefined)
    const [password, setPassword] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    var pca : PublicClientApplication // MSAL client
    //data
    const [user, setUser] = useState<User | undefined>(undefined)

    //effects
    useEffect(()=>{
        //GoogleSignin.configure()
        _initOffice()
    }, [])
    useEffect(()=>{
        _loadToken()
    }, [])


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
        console.log('init MSAL success : ' + Object.keys(pca) )
        } catch (error) {
            console.error('Problem in configuration/setup MSAL:', error);
        }
    }
    /*---------------------------
    -
    -         Storage
    -
    ----------------------------*/

    // create a function that saves your data asyncronously
    const _storeToken = async (user:User, shouldSetUser = true) => {
        try{
            const result = SInfo.setItem('loginState', JSON.stringify(user), __SInfoConfig );    
            if(shouldSetUser)
                setUser(user)
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
    

    const _loadToken = async ()=>{
        try {
            let userData = await SInfo.getItem("loginState", __SInfoConfig);
            let data : User = JSON.parse(userData);
            setUser(data)
            setLoading(false)
          } catch (error) {
            console.log("Something went wrong", error);
          }
      
    }

    const _isLoggedIn = () => {
        return user != undefined && user.token != null && user.token.state=
    }

    /*---------------------------
    -
    -         Connection
    -
    ----------------------------*/

     /*const login  = async ()=>{
        const loginState : = SInfo.getItem('loginState', {
            sharedPreferencesName: __PrefName,
            keychainService: __keyChain
        });
        if(loginState){
            setEmail(loginState.email);
            setPassword(loginState.password);
            _connect();

        }
    }*/
    function _connect(){
        setLoading(true);
        requestInstances(email, password).then(
            (data)=>{
                const usr : User= 
                {
                    email : data.email, 
                    token : {token:"1", state:TOKEN_STATE.VALID, expirationDate:""}, 
                    extra:data
                }
                
                _storeToken(usr)
                setLoading(false)
            },
            //ELSE
            ()=>{
                setLoading(false)
            },
        )
    }

    function _disconnect(){
        setUser(undefined)
        
    }

    function _connectToGoogle(){
    }

    const  _connectToOffice = async () => {
        console.log(pca);
        if(pca){
        const params: MSALInteractiveParams = {
            scopes: ["User.Read"],
          };
          console.log(pca)
          const result: MSALResult = await pca.acquireToken(params);
          if(result && result.idToken){
              //TODO attempt login with microsoft token
            
            }
        }
    }

    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    
    function _displayLogin(){
        if(loading){
            return undefined
        }else if (! _isLoggedIn()){
            return  (
                <View style={loginStyles.login_container} >
                    <IziTextInput style={loginStyles.textinput} title={locales._template.email_input.title} placeholder={locales._template.email_input.placeholder} 
                    textContentType='username' autoCapitalize='none' autoCorrect={false}
                    value={email}  onChangeText={(value:string) => {setEmail(value)}}aa/>
                    <IziTextInput style={loginStyles.textinput} title={locales._template.password_input.title} placeholder={locales._template.password_input.placeholder} secureTextEntry={true}
                    value={password}  onChangeText={(value:string) => {setPassword(value)}} textContentType='password'/>
                    
                    <Button style={loginStyles.button} title={locales._template.connect} iziStyle={_getConnectButtonStyle()} onPress={_connect }/>
                    <Button style={loginStyles.button} title={locales._template.google} iziStyle={IziButtonStyle.connection} onPress={_connectToGoogle}/>
                    <Button style={loginStyles.button} title={locales._template.office_365} iziStyle={IziButtonStyle.connection} onPress={_connectToOffice}/>
                </View>
            )
        }else{
            return (

                <View style={loginStyles.login_container} >
                    <ScrollView>
                        <Button style={loginStyles.button} title={"Deconnexion"} iziStyle={IziButtonStyle.orange} onPress={_disconnect}/>
                        <Text>{JSON.stringify(user)} </Text>
                    </ScrollView>
                </View>
            )
        }
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
        return (!isEmpty(email) && !isEmpty(password)) ?  IziButtonStyle.green : IziButtonStyle.disabled
    }

    /*---------------------------
    -
    -         Return
    -
    ----------------------------*/
    return(
        <SafeAreaView style={{flex:1}}>
            {_displayLogin()}
            {_displayLoading()}
        </SafeAreaView>
    )
}


const loginStyles = StyleSheet.create({
    textinput:{
        marginBottom:15
    },
    button:{
        marginBottom:15
    },login_container:{
        flex:1,
        justifyContent:'center',
        alignItems:'stretch'
        
    }
})


export default LoginScene
