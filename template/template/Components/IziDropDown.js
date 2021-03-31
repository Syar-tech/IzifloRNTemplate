import React ,{useState, useEffect, useRef, memo} from 'react'
import {
    View,
    Text,
    Keyboard
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { loginStyles, colors } from '../Styles/Styles'
import locale from '../../Locales/locales'


export default function IziDropdown(props){
    

    let getStyle = ()=>{
        if(typeof props.style  ==="object"){
            return {
                ...loginStyles.dropdown, ...props.style}
        }else
        return loginStyles.dropdown
    }



    /*---------------------------
    -
    -         functions
    -
    ----------------------------*/


    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/
    return(
        <View style={getStyle()}>
            <Text style={ getStyle().title }>{props.title}</Text>
            <DropDownPicker
                            controller={props.controller}
                            items={props.items}
                            onOpen={Keyboard.dismiss}
                            containerStyle={getStyle().container}
                            style={{...getStyle().dropdown, ...(props.disabled ? getStyle().dropdown.disabled : getStyle().dropdown.enabled)}}
                            itemStyle={{
                                justifyContent: 'flex-start',
                                borderColor:colors.iziflo_blue,
                            }}
                            defaultValue={props.defaultValue}
                            disabled={props.disabled}
                            placeholder={props.placeholder}
                            dropDownStyle={{backgroundColor: '#fafafa'}}
                            onChangeItem={props.onChangeItem}
                            />

        </View>
    )
}
