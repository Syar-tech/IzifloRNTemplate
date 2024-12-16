import React ,{useState} from 'react'
import { SafeAreaView, StyleSheet, Text, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import {disconnect} from "../Tools/TokenTools"
import { useLanguage } from "../Locales/locales"
import {getExampleAttachementTypesWithIdExternal} from '../API/WSApi'
import { useDispatch, useSelector } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { getMandatoryUpdateVersion, getVersionAndBuild } from '../API/LoginApi'
import { versionCompare } from '../Tools/StringTools'


const MainScene=({navigation})=>{
    const {locale} = useLanguage()
    const [attachments,setAttachments] = useState<string|undefined>(undefined)
    const isFocused = useIsFocused()

    const user = useSelector(state => state._template.user)

    const getAttachments = () =>{
        getExampleAttachementTypesWithIdExternal(navigation, 'document', 510809)
        .then((data) =>setAttachments(data));
    }

    const redirectToUpdateScreen = (deviceType, allowUpdate = true) => {
        navigation.navigate('UpdateScene',{
            deviceType,
            allowUpdate
      })
    }


    useEffect(() =>{
        //loadDeliveries(navigation,store,true)
        if(isFocused){
            checkMandatoryVersion()

            if(dispatch && user){
                loadSettings(dispatch,user)
            }
            tryLoadingData()
        }
    }, [isFocused])

  const checkMandatoryVersion = async () =>{
    
    const data = await getMandatoryUpdateVersion(user.server.id)
    
    const currentVersion = getVersionAndBuild()

    //MAX version
    if(data?.p23_version_max && Platform.OS === 'android' && false /*&& await hasUHF()*/){
      if(versionCompare(currentVersion,data.p23_version_max) === 1){
          //UPDATE NEEDED
          redirectToUpdateScreen('p23', false)
      }
    }else if(Platform.OS === 'android' && true /*&& !await hasUHF()*/ && data.app_version_max){
        if(versionCompare(currentVersion,data.app_version_max) === 1){
            //UPDATE NEEDED
            redirectToUpdateScreen('android', false)
        }
    }else if(Platform.OS === 'ios' && data.ios_version_max){
        console.log("mand3",versionCompare(currentVersion,data.ios_version_max),currentVersion,data.ios_version_max)

        if(versionCompare(currentVersion,data.ios_version_max) === 1){
            //UPDATE NEEDED
            redirectToUpdateScreen('ios', false)
        }
    }
    //min version
    if(data?.p23_version_min && Platform.OS === 'android' && false /*&& await hasUHF()*/){
        if(versionCompare(currentVersion,data.p23_version_min) === -1){
            //UPDATE NEEDED
            redirectToUpdateScreen('p23')
        }
    }else if(Platform.OS === 'android' && true /*&& !await hasUHF()*/ && data.app_version_min){
        if(versionCompare(currentVersion,data.app_version_min) === -1){
            //UPDATE NEEDED
            redirectToUpdateScreen('android')
        }
    }else if(Platform.OS === 'ios' && data.ios_version_min){
        if(versionCompare(currentVersion,data.ios_version_min) === -1){
            //UPDATE NEEDED
            redirectToUpdateScreen('ios')
        }
    }
  }
    return (
        <View
        style={styles.main_container}>
            <Text>Request content:</Text>
            <Text style={styles.text_detail}>{JSON.stringify(attachments, null, 2)}</Text>
            <View style={styles.buttons}>
                <Button style={styles.button} title="get Attachments" iziStyle={IziButtonStyle.action} onPress={()=> getAttachments() }/>
                <View style={{width:20}}/>
                <Button style={styles.button} title="Clear" iziStyle={IziButtonStyle.connection} onPress={()=> setAttachments(undefined) }/>
            </View>
            <Button style={styles.button_disconnect} title={locale._template.disconnect_upper} iziStyle={IziButtonStyle.orange} onPress={()=>disconnect(navigation, useDispatch(),locale)}/>
        </View>
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
