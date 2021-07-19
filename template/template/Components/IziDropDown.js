import React ,{useState, useEffect} from 'react'
import {
    View,
    Text,
    StyleSheet, ScrollView
} from 'react-native'
import { loginStyles, colors, sizes } from '../Styles/Styles'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Ionicons'


export default function IziDropdown(props){


    let getStyle = ()=>{
        if(typeof props.style  ==="object"){
            style = {
                ...loginStyles.dropdown, ...props.style}
        }else{
            style = loginStyles.dropdown
        }
        if(props.orientation == "horizontal"){
            style = {...style, ...style.horizontal,
                title:{...style.title, ...style.title_horizontal} ,
                dropdown:{...style.dropdown, ...style.dropdown_horizontal} 
                
            }     
        }
        return style;
    }

    const getButtonStyle = ()=>{
        return {...getStyle().button, 
            ...(props.disabled 
            ? {...getStyle().button.disabled , ...props.buttonStyleDisabled}
            : {...getStyle().button.enabled, ...props.buttonStyle})
        }
    }

    const getButtonTextStyle = ()=>{
        return {...getStyle().button.label, 
            ...(props.disabled 
            ? {...getStyle().button.label.disabled , ...props.buttonTextStyleDisabled}
            : {...getStyle().button.label.enabled, ...props.buttonTextStyle})
        }
    }

    const getDropdownTextStyle = ()=>{
        return {...getStyle().dropdown.label, 
            ...(props.disabled 
            ? {...getStyle().dropdown.label.disabled , ...props.dropdownTextStyleDisabled}
            : {...getStyle().dropdown.label.enabled, ...props.dropdownTextStyle})
        }
    }

    const getDropDownStyle = ()=>{
        return {...getStyle().dropdown, 
            ...(props.disabled 
            ? {...getStyle().dropdown.disabled , ...props.dropdownStyleDisabled}
            : {...getStyle().dropdown.enabled, ...props.dropdownStyle})
        }
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
        //if(val>0)
            props.setValue(val)
    }
    console.log("value",props.value)
    
    return(
        <View style={[getStyle()]} >
            <Text style={ getStyle().title }>{props.title}</Text>
            <View style={{alignItems:'stretch', flexDirection:'column', justifyContent:'center', flex:1}}>

                        <SelectDropdown
                            style={{flex:1}}
                            data={props.items}
                            defaultButtonText={props.placeholder}
                            defaultValue={props.value}
                            onSelect={(selectedItem, index) => {
                            _setValue(selectedItem)
                            }}
                            disabled={props.disabled}

                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.label;
                            }}
                            buttonStyle={[getButtonStyle(), {width:props.dropdownWidth,}]}
                            buttonTextStyle={getButtonTextStyle()}
                            rowTextForSelection={(item, index) => {
                                return item.label;
                            }}
                            renderDropdownIcon={() => {
                                return  (props.showArrow 
                                    ? (<Icon style={getStyle().secureImage} name={"caret-down-outline"} size={sizes.password.image.height} color={props.disabled ? colors.lightGray : colors.iziflo_blue}/> )
                                   : undefined)
                                ;
                            }}

                            dropdownIconPosition={"right"}
                            dropdownStyle={getDropDownStyle()}
                            rowTextStyle={getDropdownTextStyle()}
                            renderCustomizedRowChild={(text, index)=>{
                                return (
                                    <Text
                                    numberOfLines={1}
                                    allowFontScaling={false}
                                    style={{...{
                                        flex: 1,
                                        fontSize: 18,
                                        textAlign: "center",
                                        marginHorizontal: 8,},...getDropdownTextStyle(),...(index == props.items.indexOf(props.value) ? {color:colors.iziflo_blue} : {})}}
                        >{text}</Text>
                                )

                            }}/>
            </View>
        </View>
    )
}

IziDropdown.defaultProps={
    dropdownStyle:{},
    dropdownStyleDisabled:{},
    showArrow:true,
    disableSort:false,
    disabled:false
}