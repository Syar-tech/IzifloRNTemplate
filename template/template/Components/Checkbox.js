import React from 'react'
import {TouchableOpacity, StyleSheet, View,Text} from 'react-native'
import { SvgXml } from 'react-native-svg'
import icon_select from '../res/img/icon_select'
import { colors } from '../Styles/Styles'

export default function Checkbox({
    selected=false,
    onChange,
    style={},
    rounded=true,
    indeterminate = false,
    disabled = false
}){

    const setSelected = bool => {
        typeof onChange === 'function' && onChange(bool)
    }

    return React.createElement(disabled ? View : TouchableOpacity,{
        onPress:() => !disabled && setSelected(!selected),
        style:[styles.container,!selected ? {backgroundColor: disabled ? '#999' : 'rgb(255,255,255)',borderColor:"#999"} : {},!rounded ? {borderRadius:0,borderWidth:1,height:25,width:25}:{},indeterminate ? {borderColor:"#999"} : {},style]
    },<View>
            {indeterminate && <View style={{backgroundColor:colors.iziflo_green,justifyContent:'center',alignItems:'center',height:25,width:'100%'}}>
                <View style={{height:5,width:'60%',backgroundColor:'white',borderRadius:5}}>

                </View>
            </View>}
            {selected && <SvgXml xml={icon_select} fill="#FFF" height={15} width={15} />}
    </View>)

}

const styles = StyleSheet.create({
    container:{
        height:30,
        width:30,
        borderRadius:30,
        borderColor:'rgb(255,255,255)',
        borderStyle:'solid',
        borderWidth:2,
        backgroundColor:colors.iziflo_green,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    }
})