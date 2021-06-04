import React ,{useState, useEffect, useRef, memo} from 'react'
import {
    View,
    Text,
    Keyboard, ActivityIndicator
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker';
import { loginStyles, colors } from '../Styles/Styles'


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
        props.setValue(props.items.find((item)=>item.value == val()))
    }
    return(
        <View style={getStyle()} >
            <Text style={ getStyle().title }>{props.title}</Text>
            <View>
                <DropDownPicker
                            open={props.open? props.open : open}
                            setOpen={props.setOpen ? props.setOpen : setOpen}
                            items={props.items}
                            value={props.value?.value}
                            loading={props.loading}
                            setValue={_setValue}
                            searchable={false}
                            onOpen={props.onOpen}
                            style={{...getStyle().dropdown, ...(props.disabled ? getStyle().dropdown.disabled : getStyle().dropdown.enabled)}}
                            textStyle={props.disabled ? getStyle().dropdown.label_disabled : getStyle().dropdown.label}
                            disabled={props.disabled}
                            translation={{
                                PLACEHOLDER : props.placeholder,
                                NOTHING_TO_SHOW : props.nothingToShow,
                            }}
                            />
            </View>
            {/*props.disabled &&<View style={{backgroundColor:'white', opacity:0.6, position:'absolute', width:'100%', height:'100%', }} />*/}
        </View>
    )
}
