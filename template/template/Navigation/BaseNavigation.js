// Navigation/Navigations.js

import React, {useEffect, useRef, useState} from 'react';
import  { View, TouchableOpacity, DeviceEventEmitter, StyleSheet, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer'
import Navigation, {CustomDrawers} from '../../Navigation/Navigation'
import Corner from '../Components/CornerLabel'
import LoginScene from '../Scenes/LoginScene'
import ServerInfoModal from '../Modal/ServerInfoModal'
import MainScene from '../Scenes/MainScene'
import Config from "react-native-config";
import { SafeAreaView } from 'react-native-safe-area-context';
import DemoScene from '../Scenes/DemoScene';
import { disconnect, getStoredScheme} from '../Tools/TokenTools';
import icon_hamburger_menu from '../res/img/icon_hamburger_menu'
import AboutScene from '../Scenes/AboutScene';
import { colors } from '../Styles/Styles';
import { SvgXml } from 'react-native-svg';
import icon_about from '../res/img/icon_about'
import icon_logout from '../res/img/icon_logout'
import icon_home from '../res/img/icon_home'
import ForgotPasswordScene from '../Scenes/ForgotPasswordScene';
import ErrorScene from '../Scenes/ErrorScene';
import { CommonActions } from '@react-navigation/routers';
import ColorSchemeItem from '../Components/ColorSchemeItem';
import { connect } from 'react-redux';
import Store from '../store/SchemeStore'
import { useUserAndLanguage } from '../Locales/locales'
import VersionCheck from 'react-native-version-check'
import {versionCompare} from '../Tools/StringTools'

const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export const hamburgerMenu = navigation => (
    <TouchableOpacity onPress={() => {
        navigation.toggleDrawer()
    }} style={{marginLeft:20}}>
      <SvgXml xml={icon_hamburger_menu} height={20} width={20} fill={colors.lightBlack} />
    </TouchableOpacity>
  )

function MainStackScreen({navigation}) {
  
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
  const {locale} = useUserAndLanguage()
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
          <RootStack.Navigator navOptions={{ headerShown: true }}>

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
          </RootStack.Navigator>
           {_displayCorner()}
      </View>
  );
}

const DrawerScreen = (props)=>{

  const [newVersion,setNewVersion] = useState(false)

  useEffect(() => {
    getStoredScheme(props.defaultColorScheme).then(scheme => {
      props.dispatch({
        type:scheme
      })
    })

  },[])


  const infoModal = useRef(undefined)
  const showModal = ()=>{if(infoModal?.current) infoModal?.current.show()}
  useEffect(
    ()=> {
      DeviceEventEmitter.addListener("izi.event.showBoutModal", () => showModal())
      if(Config.FLAVOR=="P" && !__DEV__ && Config.APP_ID){
        VersionCheck.getLatestVersion()
        .then(latestVersion => {
          const currentVersion = VersionCheck.getCurrentVersion()
          if(versionCompare(latestVersion,currentVersion) === 1){
            setNewVersion(true)
          }else{
            setNewVersion(false)
          }
        }).catch(e => console.log(e));
      }

    },
    []
  )

    const storeUrl = async url => {
      const supported = await Linking.canOpenURL(url)
      if(supported)
          await Linking.openURL(url)
    }
    const {locale} = useUserAndLanguage()

  
  return (
    <SafeAreaView style={{flex:1, overflow:'hidden'}}>
            {newVersion && <TouchableOpacity style={{height:40,width:'100%',backgroundColor:colors.iziflo_blue,justifyContent:'center',alignItems:'center'}} onPress={() => {
        if(Platform.OS === 'android'){
          VersionCheck.getPlayStoreUrl().then(url => storeUrl(url))
        }else{
          VersionCheck.getAppStoreUrl({
            appID:Config.APP_ID
          }).then(url => storeUrl(url))
            .catch(e => console.log(e))
        }
      }}>
        <Text style={{color:'white',fontWeight:'bold',textDecorationLine:'underline'}}>
          {locale._template.new_update_available}
        </Text>
      </TouchableOpacity>}
        <View style={{flex:1, overflow:'hidden'}}>
          <Drawer.Navigator 
          drawerContentOptions={{showModal:showModal, drawerContent:props.drawerContent,useScheme:props.useScheme}} 
          drawerContent={(props) => CustomDrawerContent(props,locale)} 
          screenOptions={{ gestureEnabled: true }}>
            {props.children}
            
            <Drawer.Screen name='Home' 
             component={RootStackScreen} 
             initialParams={{useExample:props.useExample}}
            />

            <Drawer.Screen name="About" component={AboutScene} options={({navigation})=> ({
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
 <DrawerItemList {...props} onPress/>

*/

function CustomDrawerContent(props,locale) {
  let scheme = Store.getState().colorScheme
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
                 routes: [{ name: "MainScene" }],
             })
          );
          props.navigation.closeDrawer()
        }}/>

        {props.useScheme && <ColorSchemeItem navigation={props.navigation} />}

        <CustomDrawers />
        {props.drawerContent}

      <DrawerItem 
        label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{locale._template.aboutIziflo}</Text>} 
        icon={() => <SvgXml xml={icon_about} fill={colors[scheme].svgColor} height={25} width={25}/>}
        onPress={() => {
          props.navigation.navigate('About')
          props.navigation.closeDrawer()
        }}/>

      <DrawerItem 
        label={() => <Text style={{color:colors[scheme].textDefaultColor}}>{locale._template.disconnect}</Text>} 
        icon={() => <SvgXml xml={icon_logout} fill={colors[scheme].svgColor} height={25} width={25}/>}
        onPress={() => disconnect(props.navigation)}/>
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

export default connect()(DrawerScreen)//RootStackScreen
    
