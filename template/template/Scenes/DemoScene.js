import React ,{useState, useEffect} from 'react'
import { SafeAreaView, StyleSheet, Text, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import {disconnect, getStoredUser} from "../Tools/TokenTools"
import { useUserAndLanguage } from "../Locales/locales"
import { ModalStyle, colors} from '../Styles/Styles'
import { getBundleId, getReadableVersion } from 'react-native-device-info';
import Config from 'react-native-config';
import ActionsFooter from '../Components/Footers/ActionsFooter'
import icon_logout from '../res/img/icon_logout'
import Rotate from '../Components/Rotate'


const DemoScene=({navigation})=>{

  const {locale,user} = useUserAndLanguage()

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

            <ActionsFooter
                items={[{title:"Action", key:1}, {title:locale._template.disconnect_upper, key:99, icon:icon_logout},{title:"Action 2", key:2},{title:"Action 3", key:5},{title:"Action 4", key:1100},]}
                onPress={(key)=>{
                  if(key == 99) disconnect(navigation) 
                  else console.log('clicked on key : ',key)
                }}
                rotate={true}
                />
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    main_container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'white',
        backgroundColor:colors.lightGray
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
      marginTop: 22,
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