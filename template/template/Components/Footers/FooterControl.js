import React, { useEffect, useState } from 'react'
import {TouchableOpacity,Text, StyleSheet, useWindowDimensions} from 'react-native'
import { SvgXml } from 'react-native-svg';
import icon_home from '../../res/img/icon_home';
import { IziDimensions } from '../../Tools/Dimensions';
import Rotate from '../Rotate';

export default function FooterControl(props){

    const footerControlText = [IziDimensions.getDimension(useWindowDimensions(),{
        qdef:{
            textAlign:"center",
            width:100,
            //overflow:'visible',
            alignSelf:'center',
            fontSize:14
        },
        q600sw:{
            width:200,
            fontSize:16
        }
    })]

    return (
        <TouchableOpacity style={[styles.control,props.style ? props.style : {}, {height:"100%"}]} onPress={() => !props?.disabled && props.onPress()}>
            <Rotate style={{height:"100%",justifyContent:"center"}}rotate={props.rotate}>
                <SvgXml style={{alignSelf:"center", marginTop:3}}width={props.width} height={ props.height} xml={props.image} fill={props.frontColor}/>
                <Text style={[footerControlText,{color:props.frontColor}, props.textStyle]} numberOfLines={1}>
                    {props.text}
                </Text>
            </Rotate>
        </TouchableOpacity>
    )
}

FooterControl.defaultProps={
    height:35,
    width:35,
    image:icon_home,
    rotate:false,
    frontColor:"#272727",
    backColor:"white",
    textStyle:{}
}

const styles = StyleSheet.create({
    control:{
        flex:1
    }
})