// Navigation/Navigations.js

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator} from '@react-navigation/stack'
import LoginScene from '../template/Scenes/LoginScene'
import MainScene from '../Scenes/MainScene'


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="Main" component={MainScene} />
    </MainStack.Navigator>
  );
}

const RootStackScreen = () =>{

  return (
    <RootStack.Navigator>
        <RootStack.Screen 
            name="Login" 
            component={LoginScene}
            options={{ headerShown: false }}/>
      <RootStack.Screen
            name="Main"
            component={MainStackScreen}
            options={{ headerShown: false }}
      />
    </RootStack.Navigator>
  );
}


const MainStackNavigator = createStackNavigator()
export default RootStackScreen
    
