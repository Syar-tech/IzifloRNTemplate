import React from 'react'
import { View,StyleSheet, Platform, Image } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import DemoScene from '../template/Scenes/DemoScene';
import colors from '../template/Styles/Styles'
import {hamburgerMenu} from '../template/Navigation/BaseNavigation'

const Stack = createStackNavigator();

const headerStyle = {
    backgroundColor:colors.lightGray
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

export default RootStack