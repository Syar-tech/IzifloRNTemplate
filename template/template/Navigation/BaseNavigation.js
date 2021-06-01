// Navigation/Navigations.js

import React, {useRef} from 'react';
import  { View , TouchableWithoutFeedback, Keyboard, TouchableOpacity, StyleSheet, Text} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList} from '@react-navigation/drawer'
import Corner from '../Components/CornerLabel'
import LoginScene from '../Scenes/LoginScene'
import ServerInfoModal from '../Modal/ServerInfoModal'
import MainScene from '../Scenes/MainScene'
import Config from "react-native-config";
import { SafeAreaView } from 'react-native-safe-area-context';
import DemoScene from '../Scenes/DemoScene';
import { disconnect } from '../Tools/TokenTools';
import Icon from 'react-native-vector-icons/Ionicons'
import AboutScene from '../Scenes/AboutScene';
import locale from '../Locales/locales';
import { colors } from '../Styles/Styles';


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DummyScreen = ()=> <View style={{flex:1}}/>

function MainStackScreen({navigation}) {


const hamburgerMenu = navigation => (
    <TouchableOpacity onPress={() => {
        navigation.toggleDrawer()
    }} style={{marginLeft:20}}>
        <Icon name='menu' size={30} color='black'/>
    </TouchableOpacity>
  )
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


const _displayCorner= (showModal)=>{
  if(Config.FLAVOR != 'P')
    return (
      <Corner cornerRadius={60}
              alignment={'right'}
              style={{backgroundColor: Config.FLAVOR_COLOR, height: 24,}}
              textStyle={{color: '#fff', fontSize: 12,}}
              onPress={()=>{if(showModal) showModal()}}>
              {Config.FLAVOR_NAME}
              </Corner>)
    else return undefined
}

const RootStackScreen = (props) =>{

  return (

    <TouchableWithoutFeedback style={{flex:1}} onPress={Keyboard.dismiss}>
      <View style={{flex:1}}>
          <RootStack.Navigator navOptions={{ headerShown: true }}>

            <RootStack.Screen 
                name="Login" 
                component={LoginScene}
                options={{ headerShown: false }}/>
            <RootStack.Screen
                name="Main"
                component={props.mainNavigation ? props.mainNavigation :  MainStackScreen}
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
          </RootStack.Navigator>
           {_displayCorner(props.route.params?.showModal)}
      </View>
    </TouchableWithoutFeedback>
         
  );
}

const DrawerScreen = (props)=>{
  const infoModal = useRef(undefined)
  const showModal = ()=>{if(infoModal?.current) infoModal?.current.show()}
  return (
    <SafeAreaView style={{flex:1, overflow:'hidden'}}>
        <View style={{flex:1, overflow:'hidden'}}>
          <Drawer.Navigator drawerContentOptions={{showModal:showModal}} drawerContent={CustomDrawerContent} screenOptions={{ gestureEnabled: false }}>
              {props.children}
              <Drawer.Screen name='Home' component={RootStackScreen} initialParams={{showModal:showModal}} />
              <Drawer.Screen name="About" component={AboutScene} options={{ 
                drawerLabel:() =>  <View style={styles.drawerView}>
                {
                //<SvgXml xml={icon_about} fill={colors.iziflo_dark_gray} height={25} width={25} style={styles.drawerImage} />
                }
              <Text style={styles.drawerText} >{locale._template.aboutIziflo}</Text></View>,
            headerShown:true,
            title:locale._template.aboutIziflo }} />
          </Drawer.Navigator>
        <ServerInfoModal ref={infoModal}/>
      </View>
    </SafeAreaView>
  )
}

function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} onPress/>
      
      <DrawerItem label="Logout" onPress={() => disconnect(props.navigation)} />
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerImage:{
      marginRight:10
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
    
