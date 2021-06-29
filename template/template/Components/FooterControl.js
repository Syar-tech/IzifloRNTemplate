import React from 'react'
import {TouchableOpacity,Text, StyleSheet, useWindowDimensions} from 'react-native'
import { SvgXml } from 'react-native-svg';
import {colors} from '../Styles/Styles'
import { IziDimensions } from '../Tools/Dimensions';

export default function FooterControl(props){

    const footerControlText = [IziDimensions.getDimension(useWindowDimensions(),{
        qdef:{
            color:colors.lightBlack
        },
        q600sw:{
            fontSize:16
        }
    })]

    return (
        <TouchableOpacity style={[styles.control,props.style ? props.style : {}]} onPress={() => !props?.disabled && props.onPress()}>
            <SvgXml width={props.width ? props.width : 35} height={props.height ? props.height : 35} xml={props.image} fill={colors.lightBlack}/>
            <Text style={[footerControlText,props.textMargin ? {marginTop:props.textMargin} : {},props.textStyle ? props.textStyle : {}]}>
                {props.text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    control:{
        flex:1,
        alignItems:'center'
    }
})