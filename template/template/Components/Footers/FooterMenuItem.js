
import React, { useEffect, useState } from 'react'
import {Modal,TouchableWithoutFeedback, TouchableOpacity, Text} from 'react-native'
import { useWindowDimensions } from "react-native"
import { SvgXml } from 'react-native-svg'
import icon_home from '../../res/img/icon_home'
import { colors } from '../../Styles/Styles'
import { IziDimensions } from '../../Tools/Dimensions'

function FooterMenuItem({ onPress, height,width, title, icon, backColor, frontColor,borderColor, disabled }) {



    const footerControlText = [IziDimensions.getDimension(useWindowDimensions(),{
        qdef:{
            flex:1,
            marginLeft:5,
            fontSize:16,
        },
        q600sw:{
            fontSize:16
        }
    })]
    return (
        <TouchableOpacity style={{width:width, height:height, backgroundColor:backColor, alignItems:'center', flexDirection:'row', paddingLeft:10, paddingRight:10, borderBottomColor:borderColor, borderBottomWidth:1}} onPress={disabled ? undefined : onPress}>

            <SvgXml style={{alignSelf:"center", opacity: disabled ? 0.3 : 1}}width={25} height={ 25} xml={icon} fill={frontColor}/>
                    <Text style={[footerControlText, {color:frontColor, opacity: disabled ? 0.3 : 1}]} numberOfLines={1}>
                        {title}
                    </Text>
            
        </TouchableOpacity>
    )

}

FooterMenuItem.defaultProps={
    height:50,
    width:200,
    frontColor:"#272727",
    backColor:"white",
    title:"",
    borderColor:'rgba(0,0,0,0.3)',
    icon:icon_home,
    onPress:()=>{}
}

export default FooterMenuItem