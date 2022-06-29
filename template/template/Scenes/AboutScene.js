import React, { useEffect, useState } from 'react'
import {Alert, Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import { getBundleId, getReadableVersion } from 'react-native-device-info'
import Config from "react-native-config"
import { useLanguage } from '../Locales/locales'
import RNFS from 'react-native-fs'
import { colors } from '../Styles/Styles'
import {disconnect } from "../Tools/TokenTools"
import VersionCheck from 'react-native-version-check'
import { versionCompare } from '../Tools/StringTools'
import { useIsFocused } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { loadSettings } from '../API/LoginApi'
import IziLoader from '../Components/IziLoader'


function AboutScene({navigation,route}){
    
    const [newVersion,setNewVersion] = useState(false)

    const dispatch = useDispatch()
    
    const {locale,localeIdentifier} = useLanguage()
    const user = useSelector(state => state._template.user)
    const isFocused = useIsFocused()

    const [paramsLoading, setParamsLoading] = useState(false)


    const onUpdateParams = async () => {
        setParamsLoading(true)
        setTimeout(async () => { 
            await loadSettings(dispatch,user)
            .then(() =>setParamsLoading(false))
            .catch(() =>setParamsLoading(false))
        }, 1000)
       
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

    useEffect(() => {
        console.log("locale", localeIdentifier)
        if(Config.APP_ID){
            VersionCheck.getLatestVersion()
                .then(latestVersion => {
                    const currentVersion = VersionCheck.getCurrentVersion()

                    if(versionCompare(latestVersion,currentVersion) === 1){
                        setNewVersion(true)
                    }else{
                        setNewVersion(false)
                    }
            }).catch(e => console.log(e));
        }
    },[])

    useEffect(()=>{
        if(isFocused){
        navigation.setOptions(
            {
                title:locale._template.aboutIziflo
            })
        }
    },[locale, isFocused])

    const onDisconnect = () => {
        disconnect(navigation, dispatch,locale)
    }

    const convertLanguage = language => {
        switch(language){
            case 'fr':
            case 'fr_FR':
                return 'Français'
            case 'en':
            case 'en_EN':
                return 'English'
            break;
        }
    }

    const goToUrl = async url => {
        const supported = await Linking.canOpenURL(url)
        if(supported)
            await Linking.openURL(url)
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
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.language}</Text> : {convertLanguage(localeIdentifier)}. {locale._template.infoEditLanguage}</Text>
                </View>
                <View style={[styles.textContainer,{borderBottomWidth:0}]}>
                    <Text style={styles.modalText}><Text style={styles.title}>{locale._template.token_expires}</Text> : {user?.token?.expirationDate}</Text>
                </View>
                
            </View>
            <View>
                {newVersion && <TouchableOpacity onPress={async () => {
                    
                    if(Platform.OS === 'android'){
                        VersionCheck.getPlayStoreUrl().then(url => goToUrl(url))
                            .catch(e => console.log(e))
                    }else{
                        VersionCheck.getAppStoreUrl({
                            appID:Config.APP_ID
                        }).then(url => goToUrl(url))
                            .catch(e => console.log(e))
                    }
                }} style={[styles.textContainer,{borderBottomWidth:0,justifyContent:'center',alignItems:'center',marginBottom:10}]}>
                    <Text style={styles.modalText}><Text style={{fontSize:14,fontWeight:'bold',textDecorationLine:'underline'}}>{locale._template.new_update_available}</Text></Text>
                </TouchableOpacity>}
                {paramsLoading && <IziLoader/>}
                <Button style={styles.button} title={locale._template.updateParams} iziStyle={IziButtonStyle.connection} onPress={onUpdateParams} />
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


export default AboutScene
