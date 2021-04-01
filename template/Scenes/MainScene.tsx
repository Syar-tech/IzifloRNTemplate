import React ,{useState, useEffect} from 'react'
import { SafeAreaView, Text} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import Button ,{IziButtonStyle} from "../template/Components/IziButton"
import {disconnect} from "../template/Tools/TokenTools"
import locale from "../Locales/locales"


type RootStackParamList = {
    Main: undefined;
    Login: undefined;
  };
type Props = {
    navigation : StackNavigationProp<RootStackParamList, 'Login'>
}
const MainScene=({navigation} :Props)=>{
    const [attachments,setAttachments] = useState(undefined)

    const getAttachments = () =>{
        
    }

    return (
        <SafeAreaView>
            <Text>Main Page</Text>
            <Text style={{flex:1, backgroundColor:'white'}}></Text>
            <Button title="get Attachments" iziStyle={IziButtonStyle.action} onPress={()=> getAttachments() }/>
            <Button title={locale._template.disconnect} iziStyle={IziButtonStyle.orange} onPress={()=>disconnect(navigation)}/>
        </SafeAreaView>
    )
}

export default MainScene;