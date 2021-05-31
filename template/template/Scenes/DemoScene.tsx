import React ,{useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text, View} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack';
import Button ,{IziButtonStyle} from "../Components/IziButton"
import {disconnect, getStoredUser} from "../Tools/TokenTools"
import locale from "../Locales/locales"
import {getExampleAttachementTypesWithIdExternal} from '../API/WSApi'
import { ModalStyle, colors} from '../Styles/Styles'
import { getBundleId, getReadableVersion } from 'react-native-device-info';
import Config from 'react-native-config';
import { User } from '../Types/LoginTypes';


type RootStackParamList = {
    Main: undefined;
    Login: undefined;
  };
type Props = {
    navigation : StackNavigationProp<RootStackParamList, 'Login'>
}
const DemoScene=({navigation} :Props)=>{
    const [user, setUser] = useState<User|undefined>(undefined);
    useEffect(
        ()=>{ _loadUser()
        }
        ,[]
    )

    const _loadUser = async ()=>{
        setUser(await getStoredUser())
    }
    return (
        <SafeAreaView
        style={styles.main_container}>
            <Text>Bienvenue sur l'application de test de login.</Text>
            <View style={styles.centeredView}>
                <Text style={ModalStyle.title}>App info</Text>
                <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>App</Text> : {getBundleId()} ({getReadableVersion()})</Text>
                <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Environment</Text> : {Config.FLAVOR_NAME}</Text>
                <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Server</Text> : Demo</Text>
                <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Instance</Text> : Demo</Text>
                <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>User</Text> : {user?.email}</Text>
            </View>
            <Button style={styles.button_disconnect} title={locale._template.disconnect} iziStyle={IziButtonStyle.orange} onPress={()=>disconnect(navigation)}/>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    main_container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'white',
        padding:8,
    },
    button_disconnect:{
        marginTop:25,
        marginBottom:16,
        width:250,
        alignSelf:'center'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      width:300,
      backgroundColor: "white",
      padding: 35,
      alignItems: "stretch",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      marginBottom: 15,
      textAlign: "left"
    }
  });


export default DemoScene;