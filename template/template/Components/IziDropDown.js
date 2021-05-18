import React ,{useState, useEffect, useRef, memo} from 'react'
import {
    View,
    Text,
    Keyboard, ActivityIndicator
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { loginStyles, colors } from '../Styles/Styles'
import locale from '../../Locales/locales'
import IziLoader from './IziLoader';


export default function IziDropdown(props){

    const [open, setOpen] = useState(false);
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

    const _setValue=(val)=>{
        props.setValue(props.items.find((item)=>item.value = val()))
    }

    return(
        <View style={getStyle()}
        zIndex={props.zIndex}>
            <Text style={ getStyle().title }>{props.title}</Text>
            <View zIndex={props.zIndex}>
                <DropDownPicker
                            open={open}
                            setOpen={setOpen}
                            items={props.items}
                            value={props.value?.value}
                            loading={props.loading}
                            setValue={_setValue}
                            searchable={false}
                            onOpen={Keyboard.dismiss}
                            containerStyle={getStyle().container}
                            style={{...getStyle().dropdown, ...getStyle().dropdown.enabled}}
                            disabledStyle={getStyle().dropdown.disabled}
                            disabled={props.disabled}
                            translation={{
                                PLACEHOLDER : props.placeholder,
                                NOTHING_TO_SHOW : props.nothingToShow,
                            }}
                            />
            </View>
        </View>
    )
}
