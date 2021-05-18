import React ,{useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text, View} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import Button ,{IziButtonStyle} from "../template/Components/IziButton"
import {disconnect} from "../template/Tools/TokenTools"
import locale from "../Locales/locales"
import {getExampleAttachementTypesWithIdExternal} from '../template/API/WSApi'


type RootStackParamList = {
    Main: undefined;
    Login: undefined;
  };
type Props = {
    navigation : StackNavigationProp<RootStackParamList, 'Login'>
}
const MainScene=({navigation} :Props)=>{
    const [attachments,setAttachments] = useState<string|undefined>(undefined)

    const getAttachments = () =>{
        getExampleAttachementTypesWithIdExternal(navigation, 'document', 569496)
        .then((data) =>setAttachments(data));
    }

    return (
        <SafeAreaView
        style={styles.main_container}>
            <Text>Request content:</Text>
            <Text style={styles.text_detail}>{JSON.stringify(attachments, null, 2)}</Text>
            <View style={styles.buttons}>
                <Button style={styles.button} title="get Attachments" iziStyle={IziButtonStyle.action} onPress={()=> getAttachments() }/>
                <View style={{width:20}}/>
                <Button style={styles.button} title="Clear" iziStyle={IziButtonStyle.connection} onPress={()=> setAttachments(undefined) }/>
            </View>
            <Button style={styles.button_disconnect} title={locale._template.disconnect} iziStyle={IziButtonStyle.orange} onPress={()=>disconnect(navigation)}/>
        </SafeAreaView>
    )
}

const styles= StyleSheet.create(
    {
        main_container:{
            flex:1,
            justifyContent:'center',
            backgroundColor:'white',
            padding:8,
        },
        text_detail:{
            flex:1,
            margin:8,
            backgroundColor:'#eee',
            padding:8,
        },
        button:{
            marginTop:8,
            flexGrow:1
        },
        button_disconnect:{
            marginTop:25,
            marginBottom:16,
            width:250,
            alignSelf:'center'
        },
        buttons:{
            flexDirection:'row'
        },
        
    }
)

export default MainScene;