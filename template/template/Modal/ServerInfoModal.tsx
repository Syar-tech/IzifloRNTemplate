import React ,{useState, useImperativeHandle, useEffect} from 'react'
import {
    View, Text, StyleSheet, Modal, Pressable, Alert, Image
} from 'react-native'
import {__SInfoConfig} from '../Tools/Prefs';
import {getStoredUser} from '../Tools/TokenTools';
import Icon from 'react-native-vector-icons/MaterialIcons'
import Config from "react-native-config";

import { sizes, ModalStyle } from '../Styles/Styles'
import locale from '../../Locales/locales'
//types
import {User} from "../Types/LoginTypes"



const ServerInfoModal = React.forwardRef((props, ref ) => {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [user, setUser] = useState<User|undefined>(undefined);

    useImperativeHandle(ref, ()=>({
        show: ()=>{
            setModalVisible(true);
        }
    }))

    useEffect(
        ()=>{
            if(modalVisible) _loadUser()
        }
        ,[modalVisible]
    )

    const _loadUser = async ()=>{
        setUser(await getStoredUser())
    }
    const hide = ()=>{
        setModalVisible(false)
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
        >   
        <View style={styles.centeredView}>
            <View style={styles.modalView}>
            <Pressable
            style={ModalStyle.close_button_pressable}
            onPress={() => hide()}>
                <Icon style={ModalStyle.close_button_image} name="close" size={sizes.modal.close_icon_size} color='white'/>
            </Pressable>
            <Text style={ModalStyle.title}>App info</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Environment</Text> : {Config.FLAVOR_NAME}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Server</Text> : {user?.server?.name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Instance</Text> : {user?.server?.instance?.instance_name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>User</Text> : {user?.email}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Token expires on</Text> : {user?.token?.expirationDate}</Text>
            </View>
        </View>
        </Modal>
    )
})


const styles = StyleSheet.create({
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

  export default ServerInfoModal