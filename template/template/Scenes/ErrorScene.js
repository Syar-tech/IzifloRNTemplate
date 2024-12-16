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
import { toUint8Array } from 'pdf-lib';
import { ScrollView } from 'react-native';

const isAndroid = Platform.OS === 'android'


export default function ErrorScene(props){

    let [timeoutID, setTimeoutID] = useState(undefined)

    const params = props.route.params

    const errorMessage = params.errorMessage

    const isFocused = useIsFocused()

    let icon = null

    const window = useWindowDimensions()

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        let timeout = undefined
        if(params.closeDelay && params.closeDelay.delay && typeof params.closeDelay.callback === 'function'){
            timeout = setTimeout(() =>{
                setTimeoutID(-1) // Invalid value, used to know that the timeout function has already been triggered
                props.navigation.goBack()
                params.closeDelay.callback()
            },params.closeDelay.delay)
        }else if(params.redirect){
            timeout = setTimeout(() => {
                setTimeoutID(-1) // Invalid value, used to know that the timeout function has already been triggered
                props.navigation.navigate(params.redirect)
            },3000)
        }
        setTimeoutID(timeout)

        return ()=>{
            timeoutID && timeoutID !== -1 && clearTimeout(timeoutID) // Clear only pending timeouts
            backHandler.remove();
        } 
    }, [])

    const backAction = () => {
        const button = params.footerButtons?.find(e => e.isBackButton)
        buttonOnPressHandler(button)
        return true
    }

    const buttonOnPressHandler = (button) => {
        if (timeoutID && timeoutID !== -1) clearTimeout(timeoutID) // Clear only pending timeouts
        if (timeoutID === undefined || timeoutID !== -1) { // Trigger only if no timeout is set or if the timeout has not yet triggered
            if(typeof button?.onPress === 'function') button.onPress(props.navigation)
            else props.navigation.goBack()
        }
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


            {!!params?.footerButtons?.length && <View style={[IziDimensions.getDimension(window,footerStyle.footerContainer), params.footerStyle?.footerContainer ||{}]}>
                {params.footerButtons.map((button, index) => (
                    <FooterControl
                     key={index} 
                     frontColor={params.footerStyle?.frontColor}
                     onPress={() => {buttonOnPressHandler(button)}}
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
