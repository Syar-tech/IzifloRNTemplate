import React ,{useState, useImperativeHandle, useEffect} from 'react'
import {
    View, Text, StyleSheet, Modal, Pressable, Alert, Image
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Config from "react-native-config";
import { getBundleId, getReadableVersion } from "react-native-device-info";

import { sizes, ModalStyle } from '../Styles/Styles'
import { useSelector } from 'react-redux';




const ServerInfoModal = React.forwardRef((props, ref ) => {
    const [modalVisible, setModalVisible] = useState(false);


    useImperativeHandle(ref, ()=>({
        show: ()=>{
            setModalVisible(true);
        }
    }))

    const user = useSelector((state)=> state._template?.user)

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
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>App</Text> : {getBundleId()} ({getReadableVersion()})</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Environment</Text> : {Config.FLAVOR_NAME}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Server</Text> : {user?.server?.name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Instance</Text> : {user?.server?.instance?.instance_name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>User</Text> : {user?.email}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Token expires on</Text> : {user?.token?.expirationDate}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Hash</Text> : {Config.SIGNATURE_HASH}</Text>
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

  export default  ServerInfoModal
