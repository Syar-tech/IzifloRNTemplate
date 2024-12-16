import React from 'react'
import {View,Text, Image, TouchableOpacity, ActivityIndicator} from 'react-native'
import {loginStyles as styles} from '../Styles/Styles'

export const IziButtonStyle = {
    disabled:'disabled', green:'green', action:'action', orange:'orange', connection:'connection'
}

export default function IziButton(props){


    
    let getButtonStyle = ()=>{
        if(typeof props.iziStyle  ==="object"){
            return {...styles.button, ...props.style, ...props.iziStyle}
        }else{
            switch (props.iziStyle) {
                case IziButtonStyle.disabled:
                    return {...styles.button, ...props.style, ...styles.button.disabled}
                    break;
                case IziButtonStyle.green:
                    return {...styles.button, ...props.style,...styles.button.green}
                case IziButtonStyle.orange:
                    return {...styles.button, ...props.style, ...styles.button.orange}
                    case IziButtonStyle.connection:
                        return {...styles.button, ...props.style, ...styles.button.connection}
                case IziButtonStyle.action:
                default:
                    return {...styles.button, ...props.style, ...styles.button.action}
            }
        }
    }

    function displayText(){
        if (props.title || props.imgSrc){
            return (
            <View style={getButtonStyle().textContainer}>
                {props.imgSrc ? <Image style={getButtonStyle().image} source={props.imgSrc}/> : undefined}
                {props.title ? <Text style={getButtonStyle().text}>{props.title}</Text> : undefined}
            </View>
            )
        }
    }
     
    return(
        <TouchableOpacity style={getButtonStyle()} onPress={props.onPress}>
            {props.loading ? <ActivityIndicator color='white' size='small'/> : displayText()}
            {props.children}
        </TouchableOpacity>
    )
}
