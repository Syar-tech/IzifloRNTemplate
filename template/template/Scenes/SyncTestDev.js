import React, { useEffect, useRef, useState } from 'react'
import {Alert, DeviceEventEmitter, Linking, NativeModules, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import { getBundleId, getReadableVersion } from 'react-native-device-info'
import Config from "react-native-config"
import { useLanguage } from '../Locales/locales'
import { colors } from '../Styles/Styles'
import { useIsFocused } from '@react-navigation/core'
import { connect, useSelector, useStore} from 'react-redux'
import {loadTable, loadInventories, loadShipments } from '../../Api/LogisticApi'
import { ScrollView, Switch } from 'react-native-gesture-handler'
import IziLoader from '../Components/IziLoader'
import {useNetInfo} from "@react-native-community/netinfo";
import { ACTIONS_TYPE } from '../../Store/ReduxStore'
import Geolocation from 'react-native-geolocation-service'
import { RNCamera } from 'react-native-camera'
import { generateObjectUniqueId } from '../Tools/StringTools'
import { useModifiedDataOnly } from '../store/CommonDownReducer'
import {actions as REActions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";

const {LogisticModule} = NativeModules

function SyncTestDev({navigation,route,
    //redux states
    colorScheme, inventories, stock,locations, is_updating,companies,
    //redux actions
    resetCache
}){

    
    const {locale} = useLanguage(navigation)
    const user = useSelector(state => state._template.user)
    const [showNetInfo, setShowNetInfo] = useState(false)
    const localTransfers = useModifiedDataOnly("shipments")

    const store = useStore()

    const isFocused = useIsFocused()
    const test = useSelector(state=>{return state.companies})

    const richEditor = useRef()

    const [text, setText] = useState()

    const [buttonText, setButtonText] = useState("Scan continue")



    //const locations = useDataWithLocal("locations");

    const netInfo = useNetInfo()

    const [position,setPosition] = useState(null)

    useEffect(()=>{
        if(isFocused){
        navigation.setOptions(
            {
                title:"Sync Test (for dev eyes only!!)"
            })
        }

    },[locale, isFocused])

    useEffect(() => {
        DeviceEventEmitter.addListener('com.zlogistics.scan',tag => {
            console.log("TAG", tag)
            setText(text+"\nTag : "+JSON.stringify(tag,null,2))
        })
        DeviceEventEmitter.addListener('com.zlogistics.keydown',(keyCode)=>{
            console.log("keycode", keyCode)
            onScan()
        })

        DeviceEventEmitter.addListener('com.zlogistics.scanReady',isReady => {
            console.log("started")
            setText("started")
            if(isReady.ready === 'true'){
                setButtonText("Stop")
                LogisticModule.playSound('OK')
            }
            else{
                LogisticModule.playSound('KO')
                setButtonText("Scan continue")
            }

        })

        return () => {
            DeviceEventEmitter.removeAllListeners('com.zlogistics.scan')
            DeviceEventEmitter.removeAllListeners('com.zlogistics.scanReady')
        }
    },[])

 
    return (
        <View style={{...styles.container, backgroundColor:colors[colorScheme].backgroundColor}}>
            <View style={{flex:1, backgroundColor:'white'}}>
                <Text>{text}</Text>
                
            </View>
            <View>
                <View style={{flexDirection:"row", alignContent:'stretch', alignItems:"stretch"}}>
                    <View style={{flex:1}}/>
                    <View style={{flex:2}}>
                        <Button style={{...styles.button}} title={"Reset"} iziStyle={IziButtonStyle.connection} onPress={resetCache} />
                    </View>
                    <View style={{ flex:1, alignItems:'flex-end'}}>
                        <View style={{flexDirection:'row', alignItems:'center', paddingTop:8, paddingBottom:8}}><Text style={{color:colors[colorScheme].textDefaultColor}} onPress={()=> setShowNetInfo(!showNetInfo)}>Net Info : </Text><Switch trackColor={{ false: 'white', true: (colors.iziflo_blue + Math.round(128).toString(16)) }}  thumbColor={colors.iziflo_blue} value={showNetInfo} onValueChange={val => setShowNetInfo(val)}/></View>
                    </View>
                </View>
                <Text style={{textAlign:'center'}} >{locale._template.legal_text}</Text>
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
        width:'90%',
        alignSelf:'center',
        marginTop:10
    },
    buttonLast:{
        marginBottom:10
    },
    textContainer:{
        borderBottomColor:colors.iziflo_dark_gray,
        borderStyle:'solid',
        borderBottomWidth:1
    }
});

const mapStateToProps = state => {
    return {
        inventories: state.inventories,
        companies: state.companies,
        stock: state.stock,
        locations: state.locations,
        colorScheme : state._template.colorScheme,
        is_updating : state._template.is_updating,
    }
}

const mapDispatchToProps = dispatch => {
    return {
            
            resetCache: ()=> {dispatch({type:ACTIONS_TYPE.CLEAR_ALL_CACHE});setText("")}
    }
}

const dispatchFun = (table, dispatch)=> {return (val, i_id)=> { return dispatch({type:table+ACTIONS_TYPE.TABLE_SET, value:val, i_id })}}

export default connect(mapStateToProps,mapDispatchToProps)(SyncTestDev)
