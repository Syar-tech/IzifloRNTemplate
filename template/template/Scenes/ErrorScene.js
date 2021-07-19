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

    const [isCameraActivated,setIsCameraActivated] = useState(false)
    
    const [isStorageActivated,setIsStorageActivated] = useState(false)

    const params = props.route.params

    const errorMessage = params.errorMessage

    let icon = null

    const window = useWindowDimensions()

    //Only during the permission error
    if(Platform.OS === 'android' && params.type === 'Auth')
        +async function(){
            setIsCameraActivated(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA))
            setIsStorageActivated(await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE))
        }()


    //Only during the permission error
    const onAuthSwitch = async type => {

        let grant = null

        let cameraGranted = isCameraActivated
        let storageGranted = isStorageActivated

        switch(type){
            case 'CAMERA':
                grant = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            break;
            case 'STORAGE':
                grant = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
            break;
        }

        if(type === 'CAMERA')
            cameraGranted = grant === PermissionsAndroid.RESULTS.GRANTED
        else
            storageGranted =  grant === PermissionsAndroid.RESULTS.GRANTED

        setIsStorageActivated(storageGranted)
        setIsCameraActivated(cameraGranted)
        
        //useEffect instead
        if(cameraGranted && storageGranted)
            props.navigation.goBack(null)
    }


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
                    <FooterControl key={index} onPress={() => {button?.onPress()}} image={button.image} text={button.text} height={footerStyle.iconHeight} textStyle={{marginTop:footerStyle.iconMarginTop}}/>
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