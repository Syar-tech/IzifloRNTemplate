import React, { useEffect, useState } from 'react'
import { View,StyleSheet, Platform, Image, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import DemoScene from '../template/Scenes/DemoScene';
import {colors} from '../template/Styles/Styles'
import {hamburgerMenu} from '../template/Navigation/BaseNavigation'
import { useLanguage } from '../template/Locales/locales';
import { useDispatch, useSelector } from 'react-redux';
import { useIsDrawerOpen } from '@react-navigation/drawer';

const Stack = createStackNavigator();

const headerStyle = {
    backgroundColor:colors.lightGray,
    shadowOpacity: 0,
    shadowColor: "#000",
    elevation:0,
    borderBottomWidth:1,
    borderBottomColor:'#aaaaaa'
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
        textAlign:'center'
    }
})

function RootStack() {
    const dispatch = useDispatch()

    const isDrawerOpen = useIsDrawerOpen()


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

    const privileges =  useSelector((state)=>{
        const p = {}

            if(Array.isArray(state._template.user?.settings?.privileges))
                state._template.user.settings.privileges.forEach(privilege => {
                    for(let prop in privilege)
                        if(privilege.hasOwnProperty(prop))
                            p[prop] = privilege[prop]
                })
                const array = []
                for(let prop in p){
                    if(p[prop])
                        array.push(prop)
                }
                return array;
    })

    return (
        <>
            {// Add here custom DrawerItem
            }
            
        </>
    )
}

export default RootStack