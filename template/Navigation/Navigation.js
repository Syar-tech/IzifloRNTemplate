// Navigation/Navigations.js

import React, {useRef} from 'react';
import  { View , TouchableWithoutFeedback, Keyboard} from 'react-native';
import { createStackNavigator} from '@react-navigation/stack'
import Corner from '../template/Components/CornerLabel'
import LoginScene from '../template/Scenes/LoginScene'
import ServerInfoModal from '../template/Modal/ServerInfoModal'
import MainScene from '../Scenes/MainScene'
import Config from "react-native-config";


const MainStack = createStackNavigator();
const RootStack = createStackNavigator();

function MainStackScreen() {
  return (
      <MainStack.Navigator>
        <MainStack.Screen name="Main" component={MainScene} />
      </MainStack.Navigator>
  );
}


const _displayCorner= (infoModalRef)=>{
  if(Config.FLAVOR != 'P')
    return (
      <Corner cornerRadius={60}
              alignment={'right'}
              style={{backgroundColor: Config.FLAVOR_COLOR, height: 24,}}
              textStyle={{color: '#fff', fontSize: 12,}}
              onPress={()=>{if(infoModalRef.current) infoModalRef.current.show()}}>
              {Config.FLAVOR_NAME}
              </Corner>)
    else return undefined
}

const RootStackScreen = () =>{
  const infoModal = useRef(undefined)

  return (
    <TouchableWithoutFeedback style={{flex:1}} onPress={Keyboard.dismiss}>
      <View  style={{flex:1}}>
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
      {_displayCorner(infoModal)}
      <ServerInfoModal ref={infoModal}/>
    </View>

    </TouchableWithoutFeedback>
  );
}




const MainStackNavigator = createStackNavigator()
export default RootStackScreen
    
