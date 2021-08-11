import React ,{useState} from 'react'
import { SafeAreaView, StyleSheet, Text, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import {disconnect} from "../Tools/TokenTools"
import { useUserAndLanguage } from "../Locales/locales"
import {getExampleAttachementTypesWithIdExternal} from '../API/WSApi'


const MainScene=({navigation})=>{
    const {locale} = useUserAndLanguage()
    const [attachments,setAttachments] = useState<string|undefined>(undefined)

    const getAttachments = () =>{
        getExampleAttachementTypesWithIdExternal(navigation, 'document', 510809)
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
            <Button style={styles.button_disconnect} title={locale._template.disconnect_upper} iziStyle={IziButtonStyle.orange} onPress={()=>disconnect(navigation)}/>
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