import React , {useState} from 'react'
import {View,Text, TextInput,Image,TouchableOpacity} from 'react-native'
import {loginStyles as styles} from '../Styles/Styles'


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
                    <Image style={getStyle().secureImage}/>
                </TouchableOpacity>
            )   
        }

    }
     
    return(
        <View style={getStyle()}>
            <Text style={getStyle().title}>{props.title}</Text>
            <View style={getStyle().textinputContainer}>
                <TextInput style={getStyle().textinput} placeholder={props.placeholder} placeholderTextColor='gray' defaultValue={props.defaultValue} value={props.value} keyboardType={props.keyboardType} secureTextEntry={props.secureTextEntry && secureOverride} onChangeText={props.onChangeText} textContentType='username' autoCapitalize={props.autoCapitalize} autoCorrect={props.autoCorrect}/>
                {_displayEye()}
            </View>

        </View>
    )
}