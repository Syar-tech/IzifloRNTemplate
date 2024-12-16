import React , {useState} from 'react'
import {View,Text, TextInput,TouchableOpacity} from 'react-native'
import {loginStyles as styles, sizes} from '../Styles/Styles'
import Icon from 'react-native-vector-icons/Ionicons'


export default function IziTextInput({
    style={},
    title='',
    placeholder='',
    defaultValue='',
    value='',
    keyboardType='default',
    secureTextEntry=false,
    onChangeText= () => {},
    autoCapitalize='none',
    autoCorrect=false,
    editable=true,
    maxLength=undefined
}){

    const [secureOverride, setSecureOverride] = useState(true)

  


    let getStyle = ()=>{
        if(typeof style  ==="object"){
            return {...styles.textinput,
                textinput:{...styles.textinput.textinput,...(editable ? {} : styles.textinput.textinput_disabled)}, 
                ...style}
        }else
        return styles.textinput
    }

    const _displayEye = () => {
        if(secureTextEntry == true){
            return (
                <TouchableOpacity style={getStyle().secureImageContainer} onPress={()=>setSecureOverride(!secureOverride)}>
                    <Icon style={getStyle().secureImage} name={secureOverride ? "eye-outline" : "eye-off-outline"} size={sizes.password.image.height} color='white'/>
                </TouchableOpacity>
            )   
        }

    }
     
    return(
        <View style={getStyle()}>
            <Text style={getStyle().title}>{title}</Text>
            <View style={getStyle().textinputContainer}>
                <TextInput 
                    style={getStyle().textinput} 
                    placeholder={placeholder} 
                    placeholderTextColor='gray' 
                    defaultValue={defaultValue} 
                    value={value} 
                    keyboardType={keyboardType} 
                    secureTextEntry={secureTextEntry && secureOverride} 
                    onChangeText={onChangeText} textContentType='username' 
                    autoCapitalize={autoCapitalize} 
                    autoCorrect={autoCorrect}
                    editable={editable}
                    maxLength={maxLength}
                    //fix for font family issue on passwords
                    ref={ref => ref && ref.setNativeProps({ style: { fontFamily: Platform.OS === 'android' ? 'OpenSans-Regular' : undefined }})} />
                {_displayEye()}
            </View>

        </View>
    )
}
