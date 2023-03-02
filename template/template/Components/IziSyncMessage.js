import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import LocalizedStrings from 'react-localization'
import { RefreshControl, View , Text, TouchableOpacity} from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Animated, {Easing, EasingNode } from 'react-native-reanimated'
import { SvgXml } from 'react-native-svg'
import { useSelector } from 'react-redux'
import icon_cancel from '../../res/img/icon_cancel'

import { colors } from '../../style/style'
import { useLanguage } from '../Locales/locales'
import {B, colors as templateColors} from '../Styles/Styles'
import { formatDateAndTimeForDisplay } from '../Tools/StringTools'


export const MESSAGE_TYPE = {
    LAST_SYNC : 'last_sync',
    ERROR : 'error',
    MESSAGE : 'message',
    WARNING : 'warning',

}


const IziSyncMessage = (
    {
        table=undefined,
        syncMessage={}
    }, ref) => {

    useImperativeHandle(ref, ()=>({
            showError : (text="", showMessage = false,showDate = false, buttons=undefined)=>{
                setDisplayMessage({title:text, message:showMessage ? locale.MainMenuScene.lastSyncMessage : undefined,date: showDate ? formatDateAndTimeForDisplay(new Date(lastSync), user.settings) : undefined, type:MESSAGE_TYPE.ERROR, buttons:buttons})
            },
            dismiss:(type = null)=>{
                if(!type || type == displayMessage?.type)
                    cancelMessage()
            }
        })   
    )

    const {locale} = useLanguage()
    const user = useSelector(state => state._template.user)
    const circleRef = useRef()

    const [displayMessage, setDisplayMessage] = useState(null)
    
    const height = useState(new Animated.Value(0))[0]

    const lastSync =  useSelector((state)=> table ? state[table]?.lastTableSet : undefined) 

    useEffect(()=>{
        if(lastSync) setDisplayMessage({...{message:locale.MainMenuScene.lastSyncMessage, date:formatDateAndTimeForDisplay(new Date(lastSync), user.settings),type:MESSAGE_TYPE.LAST_SYNC}, ...syncMessage})
    }, [lastSync])

    useEffect(()=>{
        if(displayMessage){
            //console.log("animateheight", displayMessage.title || displayMessage.bottomMessage,displayMessage.buttons?.length,(displayMessage.title || displayMessage.bottomMessage ?  45 : 35) + (displayMessage.buttons?.length ? 20 : 0 ))
        Animated.timing(
            height,
            {
                toValue: (displayMessage.title || displayMessage.bottomMessage ?  45 : 35) + (displayMessage.buttons?.length ? 20 : 0 ) ,
                duration: 400,
                easing: EasingNode.out(EasingNode.back(1)),
                useNativeDriver: true
            }
        ).start()
        circleRef.current?.reAnimate(100,0, 5000 )
    }

        
     
    }, [displayMessage])


    const cancelMessage = () =>{

            Animated.timing(
                height,
                {
                    toValue: 0,
                    duration: 400,
                    easing: EasingNode.in(EasingNode.back(1)),
                    useNativeDriver: true
                }
            ).start()
    }

    return (
        <View style={{width:'100%',position:"absolute",elevation:100, zIndex:100}}>
            {<Animated.View style={{height:height,  overflow:'hidden', flexDirection:'row'}}>
            
                <View style={[{height:'100%', width:"100%", borderWidth:1, flexDirection:'column', paddingStart:10,},, displayMessage && styles.scanTypes[displayMessage.type]  ]}>
                    <View style={[{flexDirection:'row', width:'100%', flex:1,alignItems:'center'}]}>
                        <View style={{flex:1, flexDirection:'column',}}>
                            {!!displayMessage?.title && <Text style={[styles.title, displayMessage && styles.scanTypes["text_"+displayMessage.type]]}>{displayMessage && displayMessage.title}</Text> }
                            {!!displayMessage?.message &&<Text style={[styles.message, displayMessage && styles.scanTypes["text_"+displayMessage.type]]}>{displayMessage && displayMessage.message}</Text> }
                        </View>
                        
                        {!!displayMessage?.date && <Text style={[styles.date, displayMessage && styles.scanTypes["text_"+displayMessage.type]]}>{displayMessage && displayMessage.date}</Text> }

                        {
                        //if buttons
                        !!displayMessage?.buttons && <>
                            {displayMessage?.buttons?.map(button =>(
                                <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginEnd:5, marginStart:5}} onPress={() =>{typeof button?.onPress == 'function' ? button?.onPress() :  cancelMessage()}}>
                                    {!!button?.svg && <SvgXml xml={button.svg} fill={displayMessage?.type ? styles.scanTypes["text_"+displayMessage.type].color || "white" : "white"} height={16} width={16} />}
                                    <Text style={[styles.message, styles.scanTypes["text_"+displayMessage.type],{marginStart:3}]}>{button?.title || ''}</Text>
                                </TouchableOpacity>
                            ))}
                        </>
                        }
                        {
                        //no buttons
                        !displayMessage?.buttons && <TouchableWithoutFeedback style={{paddingStart:10, paddingEnd:10}} onPress={cancelMessage}>
                            <AnimatedCircularProgress
                                ref={circleRef}
                                size={26}
                                width={2}
                                prefill={100}
                                fill={0}
                                rotation={-360}
                                duration={3000}
                                childrenContainerStyle={{width:20, height:20, marginStart:1, marginTop:1,}}
                                tintColor={displayMessage?.type ? styles.scanTypes["text_"+displayMessage.type].color || "white" : "white"}
                                onAnimationComplete={cancelMessage}
                                backgroundColor="transparent">
                                { (fill) => <SvgXml  xml={icon_cancel} fill={displayMessage?.type ? styles.scanTypes["text_"+displayMessage.type].color || 'white' : 'white'} height={16} width={16}/>}
                            </AnimatedCircularProgress>
                        </TouchableWithoutFeedback>}
                        
                    </View>
                    {!displayMessage?.title && !!syncMessage?.bottomMessage && <Text style={[styles.message, {marginBottom:2, fontWeight:'bold'}, displayMessage && styles.scanTypes["text_"+displayMessage.type]]}>{!!syncMessage?.bottomMessage && syncMessage?.bottomMessage}</Text> }
                </View>
            </Animated.View>}
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

export default React.forwardRef(IziSyncMessage)