import React,{useState} from 'react'
import {View,Text,StyleSheet, PermissionsAndroid, Platform, useWindowDimensions} from 'react-native'
import {colors, footerStyle } from '../Styles/Styles'
import { SvgXml } from 'react-native-svg';
import icon_warning from '../res/img/icon_warning'
import icon_no_parameter from '../res/img/icon_no_parameter'
import icon_validate from '../res/img/icon_validate';
import FooterControl from '../Components/Footers/FooterControl';
import { IziDimensions } from '../Tools/Dimensions';

const isAndroid = Platform.OS === 'android'


export default function ErrorScene(props){

    const params = props.route.params

    const errorMessage = params.errorMessage

    let icon = null

    const window = useWindowDimensions()

    //Only during the permission erro
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

    if(params.redirect){
        setTimeout(() => {
            props.navigation.navigate(params.redirect)
        },3000)
    }

    typeof params.callback === 'function' && params.callback()

    return (
        <View style={styles.container}>
            <View style={styles.errorContainer}>
                <SvgXml width={60} height={60} xml={icon} fill="#FFF"/>
                <Text style={styles.error}>
                    {errorMessage}
                </Text>
            </View>


            {!!params?.footerButtons?.length && <View style={IziDimensions.getDimension(window,footerStyle.footerContainer)}>
                {params.footerButtons.map((button, index) => (
                    <FooterControl
                     key={index} 
                     onPress={() => {button.onPress ? button.onPress() : props.navigation.goBack()}} 
                     image = {{height:footerStyle.iconHeight, xml:button.image}}
                     text={{text:button.text, style:{marginTop:footerStyle.iconMarginTop}}}/>
                ))}
            </View>}

        </View>
    )
}

const styles = StyleSheet.create({
    auth:{
        flexDirection:'row',
        marginTop:15
    },
    authContainer:{
        marginTop:10
    },
    authText:{
        color:colors.white,
        paddingTop:3
    },
    container:{
        flex:1,
        backgroundColor:colors.lightBlack
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
        alignItems:'center'
    }
})
