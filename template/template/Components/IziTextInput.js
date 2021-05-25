import React , {useState} from 'react'
import {View,Text, TextInput,Image,TouchableOpacity} from 'react-native'
import {loginStyles as styles, sizes} from '../Styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons'


export default function IziTextInput(props){

    const [secureOverride, setSecureOverride] = useState(true)

  


    let getStyle = ()=>{
        if(typeof props.style  ==="object"){
            return {...styles.textinput, ...props.style}
        }else
        return styles.textinput
    }

    const _displayEye = () => {
        if(props.secureTextEntry == true){
            return (
                <TouchableOpacity style={getStyle().secureImageContainer} onPress={()=>setSecureOverride(!secureOverride)}>
                    <Icon style={getStyle().secureImage} name={secureOverride ? "eye-outline" : "eye-off-outline"} size={sizes.password.image.height} color='white'/>
                </TouchableOpacity>
            )   
        }

    }
     
    return(
        <View style={getStyle()}>
            <Text style={getStyle().title}>{props.title}</Text>
            <View style={getStyle().textinputContainer}>
                <TextInput 
                style={getStyle().textinput} placeholder={props.placeholder} 
                placeholderTextColor='gray' 
                defaultValue={props.defaultValue} 
                value={props.value} 
                keyboardType={props.keyboardType} 
                secureTextEntry={props.secureTextEntry && secureOverride} 
                onChangeText={props.onChangeText} textContentType='username' 
                autoCapitalize={props.autoCapitalize} 
                autoCorrect={props.autoCorrect}
                //fix for font family issue on passwords
                ref={ref => ref && ref.setNativeProps({ style: { fontFamily: Platform.OS === 'android' ? 'OpenSans-Regular' : undefined }})} />
                {_displayEye()}
            </View>

        </View>
    )
}