import React, { useEffect, useState } from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import { getBundleId, getReadableVersion } from 'react-native-device-info'
import { getStoredUser } from '../Tools/TokenTools'
import Config from "react-native-config"
import { User } from '../Types/LoginTypes'
import locale from '../Locales/locales'
import RNFS from 'react-native-fs'

export default function AboutScene(){

    const [user, setUser] = useState<User|undefined>(undefined);

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
    }

    useEffect(()=>{
        _loadUser()
    },[])

    return <View>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>App</Text> : {getBundleId()} ({getReadableVersion()})</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Environment</Text> : {Config.FLAVOR_NAME}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Server</Text> : {user?.server?.name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Instance</Text> : {user?.server?.instance?.instance_name}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>User</Text> : {user?.email}</Text>
            <Text style={styles.modalText}><Text style={{fontWeight:'bold'}}>Token expires on</Text> : {user?.token?.expirationDate}</Text>
            <TouchableOpacity onPress={onCacheReset} style={styles.modalText}><Text style={{fontWeight:'bold'}}>{locale._template.clearCache}</Text></TouchableOpacity>
    </View>

}

const styles = StyleSheet.create({
    modalText: {
      marginBottom: 15,
      textAlign: "left"
    }
  });