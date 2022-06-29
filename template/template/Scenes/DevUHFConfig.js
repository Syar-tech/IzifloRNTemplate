import React, { useEffect, useRef, useState } from 'react'
import {Alert, DeviceEventEmitter, Linking, NativeModules, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import { useLanguage } from '../Locales/locales'
import { colors } from '../Styles/Styles'
import { useIsFocused } from '@react-navigation/core'
import { connect, useDispatch, useSelector} from 'react-redux'
import { ACTIONS_TYPE } from '../../Store/ReduxStore'
import { useUHFConfig } from '../../Store/reducers/UHFConfigReducer'
import { ScrollView } from 'react-native-gesture-handler'
import { colorToComponents } from 'pdf-lib'

const {LogisticModule} = NativeModules

function SyncTestDev({navigation,route,
    //redux states
    colorScheme, inventories, stock,locations, is_updating,companies,
}){

    
    const {locale} = useLanguage(navigation)
    const user = useSelector(state => state._template.user)


    const uhfConfig = useUHFConfig()

    const uhf = useSelector(state => state.UHFConfig)
   
    const isFocused = useIsFocused()


    const [scanText, setScanText] = useState("")

    const [buttonText, setButtonText] = useState("Scan continue")

    const [displayConf, setDisplayConf] = useState({})



    const dispatch =useDispatch()

    const parameters = [
        "singleScanPower",
        "multipleScanPower",
        "RFIDTagRegEx",
        "sameTagCooldown",
        "singleTagCooldown",
        "multipleTagCooldown",
    ]

    useEffect(()=>{
        if(isFocused){
        navigation.setOptions(
            {
                title:"UHF PARAMS Test (for dev eyes only!!)"
            })
        }

    },[locale, isFocused])

    useEffect(() => {
        DeviceEventEmitter.addListener('com.zlogistics.scan',tag => {
            console.log("TAG", tag)
            setScanText("\nTag : "+JSON.stringify(tag,null,2))
        })
        
        DeviceEventEmitter.addListener('com.zlogistics.keydown',(keyCode)=>{
            console.log("keycode", keyCode)
            onScan()
        })
        

        DeviceEventEmitter.addListener('com.zlogistics.scanReady',isReady => {
            console.log("started")
            setScanText("started")
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
            DeviceEventEmitter.removeAllListeners('com.zlogistics.keydown')
        }
    },[])

 
    const onDisplayConfChanged = (text, param) => {
        console.log("onDisplayChange", text, param)

        if(!text || text.trim().length ==0)
            text = undefined
        else text = text.trim()

        if(text == displayConf[param]) return

        let conf = {...displayConf}
        conf[param] = text
        setDisplayConf(conf)
        
    }
 
    const sendParam = (param) =>{
        
        let send = {}
        send[param] = displayConf[param]
        dispatch({type:ACTIONS_TYPE.SET_UHF_CONFIG, value:send})
    }

    const onContinueScan = (start) => {
        if(start)
            LogisticModule.startContinueScan(uhfConfig.RFIDTagRegEx || '', parseInt(uhfConfig.multipleScanPower))
        else
            LogisticModule.stopScan()
    }

    const onScan = async () => {
        setScanText('')
        await LogisticModule.readUHF(uhfConfig.RFIDTagRegEx || '', parseInt(uhfConfig.singleScanPower))
    }
 
    const reset= ()=> {dispatch({type:ACTIONS_TYPE.RESET_UHF_CONFIG_DEFAULT})}

    return (
        <View style={{...styles.container, backgroundColor:colors[colorScheme].backgroundColor}}>
            <ScrollView>
                <View style={{flex:1, backgroundColor:'white',flexDirection:'column', backgroundColor:colors.lightBlack, padding:5}}>
                {parameters.map((param=>{
                    console.log("disabled", !displayConf[param] || displayConf[param].trim().length == 0)
                    const disabled = !displayConf[param] || displayConf[param].trim().length == 0
                    return (
                        <View style={{alignItems:'stretch', flex:0, marginBottom:5}}>
                            <Text style={{color:'white'}}>{param} ({uhfConfig[param]})</Text>
                            <View style={{flexDirection:'row', height:40, justifyContent:'center', alignItems:"center"}}>
                                <TextInput style={{flex:1, backgroundColor:'white', height:30, marginEnd:5,paddingStart:10,paddingEnd:10, borderRadius:15}} 
                                placeholder={uhfConfig[param]} value={displayConf} onChangeText={text => onDisplayConfChanged(text, param)}/>
                                <Button style={{...styles.button,height:"100%", width:60, height:30,minWidth:0, marginTop:0}} 
                                iziStyle={disabled ? IziButtonStyle.disabled : IziButtonStyle.connection}
                                disabled={disabled} title={"Send"} onPress={() => !disabled && sendParam(param)} />
                            </View>
                        </View>
                    )
                }))}
                </View>

                <View style={{flex:1, backgroundColor:'white'}}>
                    <Text>{JSON.stringify(uhfConfig, null, 2)}</Text>
                    <Text>{scanText}</Text>
                    
                </View>
            </ScrollView>

            
            <View>
                <View style={{flexDirection:"row", alignContent:'stretch', alignItems:"stretch"}}>
                    <View style={{flex:1, height:35,  alignItems:'center'}}>
                     <Button style={styles.button} title={"Scan"} iziStyle={IziButtonStyle.connection} onPress={onScan} />
                    </View>
                        
                    <View style={{flex:2, height:35,  alignItems:'stretch'}}>
                        <Button style={styles.button} title={buttonText} iziStyle={IziButtonStyle.connection} onPress={()=> onContinueScan(buttonText != 'Stop')} />
                    </View>
                    <View style={{ flex:1,  height:35,  alignItems:'stretch'}}>
                    <Button style={{...styles.button}} title={"Clear"} iziStyle={IziButtonStyle.connection} onPress={reset} />
                    </View>
                </View>
                <Text style={{textAlign:'center', marginTop:10}} >{locale._template.legal_text}</Text>
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
        height:35,
        minWidth:'90%',
        marginTop:10,
        marginStart:5,
        marginEnd:5,
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

export default connect(mapStateToProps)(SyncTestDev)
