// Navigation/Navigations.js

import React, {useEffect, useRef, useState} from 'react';
import  { View, TouchableOpacity, DeviceEventEmitter, StyleSheet, Text, NativeModules, Linking, AppState} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, useIsDrawerOpen} from '@react-navigation/drawer'
import Navigation from '../../Navigation/Navigation'
import {CustomDrawers} from '../../Navigation/Navigation'
import Corner from '../Components/CornerLabel'
import LoginScene from '../Scenes/LoginScene'
import ServerInfoModal from '../Modal/ServerInfoModal'
import MainScene from '../Scenes/MainScene'
import Config from "react-native-config";
import { SafeAreaView } from 'react-native-safe-area-context';
import DemoScene from '../Scenes/DemoScene';
import { disconnect} from '../Tools/TokenTools';
import icon_hamburger_menu from '../res/img/icon_hamburger_menu'
import AboutScene from '../Scenes/AboutScene';
import SyncTestDev from '../Scenes/SyncTestDev';
import { colors } from '../Styles/Styles';
import { SvgXml } from 'react-native-svg';
import icon_about from '../res/img/icon_about'
import icon_logout from '../res/img/icon_logout'
import icon_home from '../res/img/icon_home'
import ForgotPasswordScene from '../Scenes/ForgotPasswordScene';
import ErrorScene from '../Scenes/ErrorScene';
import { CommonActions } from '@react-navigation/routers';
import ColorSchemeItem from '../Components/ColorSchemeItem';
import { useLanguage } from '../Locales/locales'
import {versionCompare} from '../Tools/StringTools'
import { useDispatch, useSelector } from 'react-redux';
import {  getVersionAndBuild, getVersionCheck, openUpdateUrl } from '../API/LoginApi';
import { getVersionCheckName } from '../Tools/Tools';
import UpdateScene from '../Scenes/UpdateScene';


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const hamburgerMenu = navigation => (
    <TouchableOpacity onPress={() => {
        navigation.toggleDrawer()
    }} style={{paddingLeft:20}}>
      <SvgXml xml={icon_hamburger_menu} height={20} width={20} fill={colors.lightBlack} />
    </TouchableOpacity>
  )

function MainStackScreen({navigation, user, colorScheme}) {

  
  return (
      <MainStack.Navigator>
        <MainStack.Screen name="Example" component={MainScene} 
        options={
          {
            headerLeft:() => hamburgerMenu(navigation), // Note: using just `null` instead of a function should also work but could trigger a TS error
          }
        }
      />
      </MainStack.Navigator>
  );
}


const RootStackScreen = (props) =>{
  const {locale} = useLanguage()
  const _displayCorner= ()=>{
    if(Config.FLAVOR != 'P' && !!!Config.IS_SCREENSHOT)
      return (
        <Corner cornerRadius={60}
                alignment={'right'}
                style={{backgroundColor: Config.FLAVOR_COLOR, height: 24,}}
                textStyle={{color: '#fff', fontSize: 12,}}
                onPress={()=>{DeviceEventEmitter.emit("izi.event.showBoutModal")}}>
                {Config.FLAVOR_NAME}
                </Corner>)
      else return undefined
  }

  return (
      <View style={{flex:1}}>
          <RootStack.Navigator navOptions={{ headerShown: true, elevation:10, shadowOpacity:0.8 }}>

            <RootStack.Screen 
                name="Login" 
                component={LoginScene}
                options={{ headerShown: false }}/>
            <RootStack.Screen
                name="Main"
                component={props.useExample ? MainStackScreen : Navigation}
                options={{ headerShown: false }}
            />
            <RootStack.Screen
                name="Demo"
                component={DemoScene}
                options={{ headerShown: false }}
            /> 
            <RootStack.Screen
            name="About"
            component={AboutScene}
            options={{
              headerTitle:locale._template.aboutIziflo
            }}
          />
            <RootStack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScene}
              options={{ headerShown: false,title:locale._template.forgotten_pass_title,
              headerLeft:() => null }}
            />
            <RootStack.Screen
              name="ErrorScene"
              component={ErrorScene}
              options={{ headerShown: false,
              headerLeft:() => null }}
            />
            <RootStack.Screen
                name="UpdateScene"
                component={UpdateScene}
                options={({navigation}) => ({
                    headerLeft:() => hamburgerMenu(navigation),
                    headerRight:() => <View style={{width:30,height:30}}></View>,
                })}
            />
          </RootStack.Navigator>
           {_displayCorner()}
      </View>
  );
}

const DrawerScreen = (props)=>{

  const [newVersion,setNewVersion] = useState(false)

  let scheme = useSelector((state)=>state._template.colorScheme)
  let dispatch = useDispatch()

  const {locale} = useLanguage(false);
  const infoModal = useRef(undefined)
  const showModal = ()=>{if(infoModal?.current) infoModal?.current.show()}


  const appState = useRef(AppState.currentState);

  useEffect(() => {

    checkVersion()
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        checkVersion()
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const checkVersion  = async ()=>{
    let versionCode = await getVersionCheckName()
    console.log("versionCode",versionCode)
    DeviceEventEmitter.removeAllListeners("izi.event.showBoutModal")
    DeviceEventEmitter.addListener("izi.event.showBoutModal", () => showModal())
    if(!__DEV__){
        let currentVersion = getVersionAndBuild()
        console.log(currentVersion)
        getVersionCheck(versionCode).then(version =>{
            if(version?.error){
              console.log("check version error", version.error, versionCode, Platform.OS, Config.IS_BUNDLE)
            }
            if(version?.version){
            if(versionCompare(version.version,currentVersion) === 1){
                setNewVersion(version)
              } else{
                setNewVersion(false)
              }
            }
        })
    }
  }




  const extraOptions = {showModal:showModal, drawerContent:props.drawerContent,useScheme:props.useScheme};
  return (
    <SafeAreaView style={{flex:1, overflow:'hidden'}}>
            {newVersion && <TouchableOpacity style={{height:40,width:'100%',backgroundColor:colors.iziflo_blue,justifyContent:'center',alignItems:'center'}} onPress={openUpdateUrl}>
        <Text style={{color:'white',fontWeight:'bold',textDecorationLine:'underline'}}>
          {locale._template.new_update_available}
        </Text>
      </TouchableOpacity>}
        <View style={{flex:1, overflow:'hidden'}}>
          <Drawer.Navigator 
          drawerContent={(props) => CustomDrawerContent({...props, ...extraOptions},locale,scheme, dispatch)} 
          screenOptions={{ gestureEnabled: true, headerShown:false,drawerContent:props.drawerContent}}>
            {props.children}
            
            <Drawer.Screen name='Home' 
             component={RootStackScreen} 
             initialParams={{useExample:props.useExample}}
            />

            <Drawer.Screen name="About" component={AboutScene} options={({navigation})=> ({
              headerShown:true,
              headerLeft:() => hamburgerMenu(navigation),
            })}/>
            <Drawer.Screen name="SyncTest" component={SyncTestDev} options={({navigation})=> ({
              headerShown:true,
              headerLeft:() => hamburgerMenu(navigation),
            })}/>
          </Drawer.Navigator>
        <ServerInfoModal ref={infoModal}/>
      </View>
    </SafeAreaView>
  )
}

/*
 <DrawerItemList {...props} onPress/>é
*/
function CustomDrawerContent(props,locale,scheme, dispatch) {
  
  return (
    <DrawerContentScrollView {...props} style={{margin:0,padding:0,backgroundColor:colors[scheme].backgroundColor}}>
        <DrawerItem 
        label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{locale._template.home}</Text>} 
        icon={() => <SvgXml xml={icon_home} fill={colors[scheme].svgColor} height={25} width={25}/>}
          onPress={() => {
            props.navigation.navigate('Home')
            props.navigation.dispatch(
              CommonActions.reset({
                 index: 0,
                 routes: [{ name: "MainMenuScene" }],
             })
          );
          props.navigation.closeDrawer()
        }}/>

        {props.useScheme && <ColorSchemeItem navigation={props.navigation}/>}

        <CustomDrawers navigation={props.navigation} />

        {props.drawerContent}
        

      <DrawerItem 
        label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{locale._template.aboutIziflo}</Text>} 
        icon={() => <SvgXml xml={icon_about} fill={colors[scheme].svgColor} height={25} width={25}/>}
        onPress={() => {
          props.navigation.navigate('About')
          props.navigation.closeDrawer()
        }}/>

        {(Config.FLAVOR == 'D' || !!__DEV__) && <DrawerItem 
          label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{"Sync Test for Dev"}</Text>} 
          icon={() => <SvgXml xml={icon_about} fill={colors[scheme].svgColor} height={25} width={25}/>}
          onPress={() => {
            props.navigation.navigate('SyncTest')
            props.navigation.closeDrawer()
          }}/>}

      <DrawerItem 
        label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{locale._template.disconnect}</Text>} 
        icon={() => <SvgXml xml={icon_logout} fill={colors[scheme].svgColor} height={25} width={25}/>}
        onPress={() => disconnect(props.navigation, dispatch,locale)}/>
    </DrawerContentScrollView>
  );
}


const styles = StyleSheet.create({
  drawerImage:{
      marginRight:32
  },
  drawerText:{
      color:colors.iziflo_dark_gray
  },
  drawerView:{
      flex:1,
      justifyContent:'flex-start',
      flexDirection:'row',
      alignItems:'center'
  }
})

export default DrawerScreen//RootStackScreen
