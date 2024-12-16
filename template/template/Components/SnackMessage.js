import { id } from 'date-fns/locale'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import LocalizedStrings from 'react-localization'
import { RefreshControl, View , Text} from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import Animated, {Easing, EasingNode, useAnimatedStyle, useSharedValue, withSpring, withTiming, FadeIn, FadeOut, FadeInLeft, FadeOutLeft, FadeOutRight } from 'react-native-reanimated'
import { Button } from 'react-native-share'
import { SvgXml } from 'react-native-svg'
import { useSelector } from 'react-redux'
import TopShadowOverlay from '../Components/TopShadowOverlay'
import icon_cancel from '../../res/img/icon_cancel'

import { colors } from '../../styles/styles'
import { useLanguage } from '../Locales/locales'
import {B, colors as templateColors} from '../Styles/Styles'
import { formatDateAndTimeForDisplay } from '../Tools/StringTools'


export const COLORSET = {
    DEFAULT:'DEFAULT',
    ORANGE:'ORANGE',
    GREEN:'GREEN',
    RED:'RED',
}

export const HEIGHT = {
    DEFAULT:40,
    SMALL:30,
    LARGE:50,
    TWO_LINES:60,
    NONE:0
}
export const DEFAULT_STYLE = {

    height: HEIGHT.DEFAULT,
    colorset: COLORSET.DEFAULT,
    entering:FadeInLeft,
    exiting:FadeOutRight,

}

export const FlipView = ({
    children,
    displayedStyle
} ) => {
    const [show, setShow] = useState(false);
    const [internChildren, setInternChildren] = useState({children1:undefined, children2:undefined});
    const colorScheme = useSelector((state) => state._template.colorScheme);
    useEffect(()=>{
        setShow(!show)
        setInternChildren({
            children1:!show? children : internChildren.children1,
            children2:show? children : internChildren.children2
        })
    }, [children])
    
    return (
      <View style={{width:"100%", height:'100%'}}>
        {show ? (
          <View style={{justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}} entering={displayedStyle?.entering} exiting={displayedStyle?.exiting}>{internChildren.children1}</View>
        ) : null}
        {!show ? (
          <View style={{justifyContent:'center', alignItems:'center', width:'100%', height:'100%'}} entering={displayedStyle?.entering} exiting={displayedStyle?.exiting}>{internChildren.children2}</View>
        ) : null}
      </View>
    );
  };

const SnackMessage = (
    {
        styleType=undefined,
        children
    }) => {



    const {locale} = useLanguage()
    const user = useSelector(state => state._template.user)
    const colorScheme = useSelector((state) => state._template.colorScheme);

    const [displayedStyle, setDisplayedStyle] = useState(null)


    const animatedStyle =useAnimatedStyle(() => ({
        height: displayedStyle?.height || 0,//withSpring(displayedStyle?.height || 0,{duration:500}),
        backgroundColor:displayedStyle?.colorset?.background || templateColors[colorScheme].listOverlay, //withTiming(displayedStyle?.colorset?.background || templateColors[colorScheme].listOverlay, {duration:500}),
    }))

    const containerStyle = {
        height: displayedStyle?.height || 0,//withSpring(displayedStyle?.height || 0,{duration:500}),
        overflow:'hidden', 
        flexDirection:'row', 
        backgroundColor:displayedStyle?.colorset?.background || templateColors[colorScheme].listOverlay, //withTiming(displayedStyle?.colorset?.background || templateColors[colorScheme].listOverlay, {duration:500}),
        width:"100%",
        alignItems:'center',
        justifyContent:'center'
    }


    const getColorSet = (colorset)=>{

        switch(colorset){
            case COLORSET.GREEN:
                return {name : COLORSET.GREEN ,text:'#FFFFFF',background:"rgb(117, 190, 72)", r:117, g:190, b:72}//colors.green}
            case COLORSET.ORANGE:
                return {name : COLORSET.ORANGE ,text:'#FFFFFF',background:"rgb(250, 165, 66)", r:250, g:165, b:66}//colors.orange}
                case COLORSET.RED:
                    return {name : COLORSET.RED ,text:'#FFFFFF',background:"rgb(180, 65, 65)", r:180, g:65, b:65}//colors.redError}
            case COLORSET.DEFAULT:
            default:
                return {
                    name : COLORSET.DEFAULT +'_'+colorScheme,
                    text:templateColors[colorScheme].textDefaultColor,
                    background:templateColors[colorScheme].listOverlay,
                    r:255, g:255, b:255
                }
        }
    }
   useEffect(()=>{
        if(!children) setDisplayedStyle(null)
       else {
        let newStyle = {...DEFAULT_STYLE, colorset:styleType.colorset, height:styleType.height/*...styleType*/}
        newStyle.colorset=getColorSet(newStyle.colorset)
        if(newStyle.colorset.name != displayedStyle?.colorset?.name ) setDisplayedStyle(newStyle)
    }
    }, [styleType, children])

    
    return (
        <View style={{width:'100%',elevation:100, zIndex:100}}>
            <TopShadowOverlay mode ={colorScheme}/>
            {<View style={[containerStyle]}>
                    {children}
                {/*<FlipView displayedStyle={displayedStyle}>
                    {children}
    </FlipView>*/}
            
            </View>}
        </View>
    )
    
}

const styles = {
    scanTypes:{
        error:{
            backgroundColor:colors.lightRed,
            borderColor:colors.red,
        },
        last_sync:{
            backgroundColor:colors.lightGreen,
            borderColor:colors.green,
        },
        warning:{
            backgroundColor:colors.lightOrange,
            borderColor:colors.orange,
        },
        text_error:{
            color:colors.red,
        },
        text_last_sync:{
            color:colors.green,
        },
        text_warning:{
            color:colors.orange,
        },

    },
    title:{
         color:'white',
         fontWeight:'bold', 
         fontSize:14,
         flex:1,
    },
    message:{
         color:'white',
         fontSize:14,
    },
    date:{
         color:'white',
         fontSize:14,
         marginStart:10,
    }
}

export default SnackMessage
