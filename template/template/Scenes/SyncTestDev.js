import React, { useEffect, useRef, useState } from 'react'
import {Alert, DeviceEventEmitter, Linking, NativeModules, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Button ,{IziButtonStyle} from "../Components/IziButton"
import { getBundleId, getReadableVersion } from 'react-native-device-info'
import Config from "react-native-config"
import { useLanguage } from '../Locales/locales'
import { colors } from '../Styles/Styles'
import { useIsFocused } from '@react-navigation/core'
import { connect, useSelector, useStore} from 'react-redux'
import { ScrollView, Switch } from 'react-native-gesture-handler'
import {useNetInfo} from "@react-native-community/netinfo";
import { ACTIONS_TYPE } from '../../Store/ReduxStore'
import { useModifiedDataOnly } from '../store/CommonDownReducer'


function SyncTestDev({navigation,route,
    //redux states
    colorScheme, 
    //redux actions
    resetCache
}){

    
    const {locale} = useLanguage(navigation)
    const user = useSelector(state => state._template.user)
    const [showNetInfo, setShowNetInfo] = useState(false)

    const store = useStore()

    const isFocused = useIsFocused()


    const [text, setText] = useState()


    const [showMessage, setShowMessage] = useState(false)


    useEffect(()=>{
        if(isFocused){
        navigation.setOptions(
            {
                title:"Sync Test (for dev eyes only!!)"
            })
        }

    },[locale, isFocused])

 
    return (
        <View style={{...styles.container, backgroundColor:colors[colorScheme].backgroundColor}}>
            <View style={{flex:1, backgroundColor:'red'}}>
                <Button title={(showMessage && <Text>PResta 111</Text>)  || <Text>PResta 222</Text> } onPress={()=> setShowMessage(!showMessage)}></Button>
                
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
    }
}

export default connect(mapStateToProps)(SyncTestDev)
