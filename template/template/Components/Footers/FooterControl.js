import React, { useEffect, useState } from 'react'
import {TouchableOpacity,Text, StyleSheet, useWindowDimensions, View} from 'react-native'
import { SvgXml } from 'react-native-svg';
import TopShadowOverlay from '../../Components/TopShadowOverlay';
import icon_home from '../../res/img/icon_home';
import { colors } from '../../Styles/Styles';
import { IziDimensions } from '../../Tools/Dimensions';
import Rotate from '../Rotate';

export default function FooterControl({
    style = {},
    rotate = false,
    image = {width:50, height:50, xml:icon_home, color:'gray'},
    frontColor="gray",
    disabled=false,
    onPress=()=>{},
    text={text:"", style:{}, color:'gray'},
    badge=undefined,//{value=2,offset:{top:5, left:5}}
}){

    const [isLandscape, setIsLandscape] = useState(false)

    const footerControlText = IziDimensions.getDimension(useWindowDimensions(),{
        qdef:{
            textAlign:"center",
            width:100,
            //overflow:'visible',
            alignSelf:'center',
            fontSize:14
        },
        q552sw:{
            width:200,
            fontSize:16
        }
    })
    
    return (
        <TouchableOpacity style={[styles.control,style, {height:"100%"}]} onPress={() => !disabled && onPress()}>
            {rotate && 
                <Rotate style={{height:"100%",justifyContent:"center", opacity : disabled ? 0.3 : 1}} rotate={rotate} onRotate={(orientation)=>{rotate && setIsLandscape(!!orientation?.startsWith("LANDSCAPE"))}}>
                    <SvgXml style={{alignSelf:"center", marginTop:3}}width={image.width || 25} height={ image.height || 25} xml={image.xml || icon_home} fill={image.color || frontColor || 'gray'}/>
                    {!!badge && <View style={{position:"absolute",width:10, height:10, left:(footerControlText.width + (badge?.offset?.left  || 0 )), top:(badge?.offset?.top  || 0 ), borderRadius:5,backgroundColor:"red"}}/>}
                    <Text style={[
                        footerControlText,
                        {color:text.color || frontColor || 'gray'}, 
                        text.style || {},
                        (isLandscape ? styles.footerControlTextLandscape :{})
                    ]} numberOfLines={isLandscape ? 3 : 1}>
                        {text.text || ''}
                    </Text>
                </Rotate>
            }
            {!rotate && <View style={{height:"100%",justifyContent:"center", opacity : disabled ? 0.3 : 1}}>
                <SvgXml style={{alignSelf:"center", marginTop:3}}width={image.width || 25} height={ image.height || 25} xml={image.xml || icon_home} fill={image.color || frontColor || 'gray'}/>
                {!!badge && 
                    <View 
                    style={{position:"absolute",minWidth:badge.value ? 16 : 10, 
                    height:badge.value ? 16 : 10,
                    borderRadius:badge.value ? 8 : 5,  
                    paddingLeft:badge.value ? 3 : 0 ,
                    paddingRight:badge.value ? 3 : 0, 
                    justifyContent:"center",
                    left:(footerControlText.width/2 + (badge?.offset?.left  || 0 )),
                    top:(badge?.offset?.top  || 0 ),
                    backgroundColor:"red", 
                    alignItems:'center', 
                    justifyContent:'center', 
                    borderWidth:1, 
                    borderColor:'white'}}>
                        {!!badge.value && <Text style={{fontSize:10, color:"white", fontWeight:'bold'}} >{badge.value}</Text>}
                    </View>
                }
                <Text style={[
                    footerControlText,
                    {color:text.color || frontColor || 'gray'}, 
                    text.style || {},
                    (isLandscape ? styles.footerControlTextLandscape :{})
                ]} numberOfLines={isLandscape ? 3 : 1}>
                    {text.text || ''}
                </Text>
            </View>}
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
    },

    footerControlTextLandscape:{
        width:50,
        height:50,
        fontSize:9
    }
})
