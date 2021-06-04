import React from 'react'
import { View,StyleSheet, Platform, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import icon_hamburger_menu from '../template/res/img/icon_hamburger_menu'
import { createStackNavigator } from '@react-navigation/stack';
import DemoScene from '../template/Scenes/DemoScene';
import colors from '../template/Styles/Styles'

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
    hamburgerMenu:{
        marginLeft:20
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

const hamburgerMenu = navigation => (
    <TouchableOpacity onPress={() => {
        navigation.toggleDrawer()
    }} style={styles.hamburgerMenu}>
        <SvgXml xml={icon_hamburger_menu} height={20} width={20} fill={colors.lightBlack} />
    </TouchableOpacity>
)

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