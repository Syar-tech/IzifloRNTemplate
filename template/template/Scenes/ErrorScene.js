import React,{useEffect, useState} from 'react'
import {View,Text,StyleSheet, PermissionsAndroid, Platform, useWindowDimensions, BackHandler} from 'react-native'
import {colors, footerStyle } from '../Styles/Styles'
import { SvgXml } from 'react-native-svg';
import icon_warning from '../res/img/icon_warning'
import icon_no_parameter from '../res/img/icon_no_parameter'
import icon_validate from '../res/img/icon_validate';
import FooterControl from '../Components/Footers/FooterControl';
import { IziDimensions } from '../Tools/Dimensions';
import { useIsFocused } from '@react-navigation/native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { toUint8Array } from 'pdf-lib';

const isAndroid = Platform.OS === 'android'


export default function ErrorScene(props){

    const params = props.route.params

    const errorMessage = params.errorMessage

    const isFocused = useIsFocused()

    let icon = null

    let timeout = undefined

    const window = useWindowDimensions()

    useEffect(()=>{
          
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );
    
        return () => backHandler.remove();
    }, [])

    const backAction = () => {
        const button = params.footerButtons?.find(e => e.isBackButton)
        if (timeout) clearTimeout(timeout)
        if(typeof button?.onPress === 'function') button.onPress(props.navigation)
        else props.navigation.goBack()
        return true
    }

    //Only during the permission error
    switch(params.icon){
        case 'warning':
            icon = icon_warning
        break
        case 'no_parameter':
            icon = icon_no_parameter
        break
        case 'validate':
            icon = icon_validate
        break
        default:
            icon = params.icon
        break
    }

    const getBackColor = ()=>{
        return props.route.params.backColor || colors.lightBlack
    }
    const getTextColor = ()=>{
        return props.route.params.textColor || "white"
    }


    useEffect(()=>{
        if(params.closeDelay && params.closeDelay.delay && typeof params.closeDelay.callback === 'function'){
            timeout = setTimeout(() =>{props.navigation.goBack();params.closeDelay.callback()},params.closeDelay.delay)
        }else if(params.redirect){
            timeout = setTimeout(() =>props.navigation.navigate(params.redirect),3000)
        }
        return ()=>{timeout && clearTimeout(timeout)} 
    }, [])

    return (
        <View style={{...styles.container, backgroundColor:getBackColor()}}>
            <View style={styles.errorContainer}>
                <SvgXml width={60} height={60} xml={icon} fill={getTextColor()}/>
                <Text style={[styles.error, {color:getTextColor()}]}>
                    {errorMessage}
                </Text>
                {!!params.list && <View style={{...styles.listContainer, borderColor:getTextColor()}}>
                    <ScrollView contentContainerStyle={{width:'100%'}}><>
                    {params.list.map((element,key) => (
                        <View style={{...styles.listCell, borderBottomWidth:key == params.list.length -1 ? 0 : 1, borderColor:getTextColor()}}>
                            <Text key={key} style={{fontSize:14,color:getTextColor(), flex:1}}>
                                {element.title}
                            </Text>
                            {!!element.right && <Text key={key} style={{fontSize:14,color:getTextColor(),}}>
                                {element.right}
                            </Text>} 
                        </View>
                    ))}
                    </></ScrollView>
                    </View>//*/
                }
                {params.confirmationMessage && <Text style={[styles.error,{color:getTextColor()}]}>
                    {params.confirmationMessage}
                </Text>}
            </View>


            {!!params?.footerButtons?.length && <View style={IziDimensions.getDimension(window,footerStyle.footerContainer)}>
                {params.footerButtons.map((button, index) => (
                    <FooterControl
                     key={index} 
                     onPress={() => {button.onPress ? button.onPress(props.navigation) : props.navigation.goBack()}} 
                     image = {{height:footerStyle.iconHeight, xml:button.image,color:button.tint || '#272727',}}
                     text={{text:button.text,color:button.tint || '#272727', style:{marginTop:footerStyle.iconMarginTop}}}/>
                ))}
            </View>}

        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.lightBlack,
    },
    error:{
        color:'white',
        marginTop:20,
        fontSize:20,
        paddingLeft:35,
        paddingRight:35,
        textAlign:'center',
        marginTop:10
    },
    errorContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:15, 
        paddingBottom:15
    },
    listContainer:{
        borderColor:"white",
        borderRadius:10,
        borderWidth:1,
        marginTop:30,
        marginLeft:20,
        marginRight:20,
        width:'90%',
        maxWidth:400,
        flexGrow:0,
        flexShrink:1,
        overflow:"hidden"
    },
    listCell:{
        width:'100%',
        height:45,
        alignItems:'center',
        flexDirection:'row',
        borderBottomWidth:1,
        borderColor:"white",
        paddingLeft:10,
        paddingRight:10,

    }
})