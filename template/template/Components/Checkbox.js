import React from 'react'
import {TouchableOpacity, StyleSheet, View,Text} from 'react-native'
import { SvgXml } from 'react-native-svg'
import icon_minus_bold from '../res/img/icon_minus_bold'
import icon_select from '../res/img/icon_select'
import { colors } from '../Styles/Styles'

export default function Checkbox({
    selected=false,
    onChange,
    style={},
    size='normal',
    rounded='all',
    indeterminate = false,
    showTick = true,
    disabled = false,
    radioBorder='#999',
    tickColor='#FFF',
    backgroundColorChecked=undefined,
    backgroundColorCheckedDisabled='#BDBDBD',
}){

    const setSelected = bool => {
        typeof onChange === 'function' && onChange(bool)
    }
    
    return React.createElement(disabled ? View : TouchableOpacity,{
        onPress:() => !disabled && setSelected(!selected),
        style:[
            styles.inner_container,
            size=='large' ? styles.inner_container_large : {},
            !selected && !indeterminate ? {backgroundColor: disabled ? backgroundColorCheckedDisabled : 'rgb(255,255,255)',borderColor:radioBorder} : {backgroundColor : backgroundColorChecked || colors.iziflo_green},
            rounded == 'all' || rounded == 'radio' 
                ? {} 
                : rounded == 'corner' ? {borderRadius:4,borderWidth:1}: {borderRadius:0,borderWidth:1},
            rounded == 'radio' && selected
            ? size=='large' ? {height:36, width:36, borderRadius:18} : {height:26, width:26, borderRadius:13}
            : {},
            style
        ]
    },
    <>
        {showTick && indeterminate && !selected && <SvgXml xml={icon_minus_bold} fill={tickColor} height={30} width={30}/>}
        {showTick && selected && !indeterminate && <SvgXml xml={icon_select} fill={tickColor} height={size == 'large' ? 25 : 15} width={size == 'large' ? 25 : 15} />}
    </>)

}

const styles = StyleSheet.create({
    container:{
        height:30,
        width:30,
        borderRadius:15,
        borderColor:colors.iziflo_green,
        borderStyle:'solid',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    container_large:{
        height:40,
        width:40,
        borderRadius:20,
    },
    inner_container:{
        height:30,
        width:30,
        borderRadius:15,
        borderColor:'rgb(255,255,255)',
        borderStyle:'solid',
        borderWidth:2,
        backgroundColor:colors.iziflo_green,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center'
    },
    inner_container_large:{
        height:40,
        width:40,
        borderRadius:20,
    }
})