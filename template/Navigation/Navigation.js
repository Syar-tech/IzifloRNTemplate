import React, { cloneElement, useEffect, useState } from 'react'
import { View,StyleSheet, Platform, Image, Text, Keyboard, TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import DemoScene from '../template/Scenes/DemoScene';
import {colors} from '../styles/styles'
import {hamburgerMenu} from '../template/Navigation/BaseNavigation'
import { useLanguage } from '../template/Locales/locales';
import { useDispatch, useSelector } from 'react-redux';
import { DrawerItem, useDrawerStatus } from '@react-navigation/drawer';
import icon_back from '../template/res/img/icon_back';
import { SvgXml } from 'react-native-svg';
import icon_warning from '../template/res/img/icon_warning';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import icon_sync from '../res/img/icon_sync';

const Stack = createStackNavigator();

const headerStyle = {
    elevation:0

}

if(Platform.OS === 'android')
    headerStyle.height = 50

const styles = StyleSheet.create({
    drawerImage:{
        marginRight:10
    },
    drawerText:{
        color:colors.lightBlack
    },
    drawerView:{
        flex:1,
        justifyContent:'flex-start',
        flexDirection:'row',
        alignItems:'center'
    },
    headerContainer:{
        flex:1,
        flexDirection:'row',
        width:'100%'
    },
    iconRight:{
        marginRight:10
    },
    twoLines:{
        width:'100%',
        justifyContent:'center'
    },
    textTwoLines:{
        textAlign:'center',
        fontSize:18
    }
})

function RootStack() {
    const dispatch = useDispatch()
    let scheme = useSelector((state)=>state._template.colorScheme)
    const user = useSelector(state => state._template.user)

    const isDrawerOpen = useDrawerStatus() =="open"


    useEffect(()=>{
        if(isDrawerOpen)
            Keyboard.dismiss()
    }, [isDrawerOpen])
  
    return (
      <Stack.Navigator
        initialRouteName="ScanScene"
        screenOptions={{ gestureEnabled: false }}
      >
        <Stack.Screen
          name="Demo"
          component={DemoScene}
          options={({navigation}) => ({
            headerStyle,
            headerLeft:() => hamburgerMenu(navigation),
            headerRight:() => <View style={{width:30,height:30}}></View>
        })}
        />
      </Stack.Navigator>
    );
}


export const CustomDrawers= (props)=>{


    let scheme = useSelector((state)=>state._template.colorScheme)
    const {locale} = useLanguage(false);
    const user = useSelector(state => state._template_user)

    const privileges = useSelector(privilegesSelector)

    return (
        <>
            {// Add here custom DrawerItem
            }
            
        </>
    )
}

export default RootStack
