import React, { useEffect, useState } from 'react'
import {Alert, StyleSheet, Text, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import { getBundleId, getReadableVersion } from 'react-native-device-info'
import { getStoredUser } from '../Tools/TokenTools'
import Config from "react-native-config"
import locale from '../Locales/locales'
import RNFS from 'react-native-fs'
import { colors } from '../Styles/Styles'
import {disconnect } from "../Tools/TokenTools"
import { useIsFocused } from '@react-navigation/native'

export default function AboutScene({navigation}){
    const isFocused = useIsFocused()
    const [user, setUser] = useState(undefined);

    const _loadUser = async ()=>{
        setUser(await getStoredUser())
    }

    const onCacheReset = () => {
        if(typeof RNFS !== undefined){
            RNFS.readDir(RNFS.CachesDirectoryPath).then(data => {
                data.forEach(res => {
                    if(res.isFile())
                        RNFS.unlink(res.path)
                })
            })
        }
        Alert.alert(locale._template.clearCache,locale._template.cacheHasBeenCleared)
    }

    const onDisconnect = () => {
        disconnect(navigation)
    }

    useEffect(()=>{
        if(isFocused)
            _loadUser()
    },[isFocused])

    const convertLanguage = language => {
        switch(language){
            case 'fr':
                return 'Français'
            case 'en':
                return 'English'
            break;
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.app}</Text> : {getBundleId()} ({getReadableVersion()})</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.environment}</Text> : {Config.FLAVOR_NAME}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.server}</Text> : {user?.server?.name}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.instance}</Text> : {user?.server?.instance?.instance_name}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.user}</Text> : {user?.email}</Text>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.language}</Text> : {convertLanguage(user?.settings?.language)}</Text>
                </View>
                <View style={[styles.textContainer,{borderBottomWidth:0}]}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.token_expires}</Text> : {user?.token?.expirationDate}</Text>
                </View>
            </View>
            <View>
                <Button style={styles.button} title={locale._template.clearCache} iziStyle={IziButtonStyle.connection} onPress={onCacheReset} />
                <Button style={styles.button} title={locale._template.disconnect} iziStyle={IziButtonStyle.connection} onPress={onDisconnect} />
                <Text style={{textAlign:'center'}}>{locale._template.legal_text}</Text>
            </View>

        </View>
    )

}

const styles = StyleSheet.create({
    container:{
        padding:20,
        flex:1,
        justifyContent:'space-between'
    },
    modalText: {
      marginBottom: 10,
      textAlign: "left",
      marginTop:10
    },
    title:{
        fontSize:16,
        fontWeight:'bold'
    },
    button:{
        width:'50%',
        alignSelf:'center',
        marginBottom:20
    },
    textContainer:{
        borderBottomColor:colors.iziflo_dark_gray,
        borderStyle:'solid',
        borderBottomWidth:1
    }
});