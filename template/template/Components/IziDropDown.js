import React ,{useState, useEffect, useRef} from 'react'
import {
    View,
    Text,
    StyleSheet, ScrollView, TouchableOpacity
} from 'react-native'
import { loginStyles, colors, sizes ,filterObject} from '../Styles/Styles'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Ionicons'
import Checkbox from '../../Components/Checkbox'
import { useLanguage } from '../Locales/locales'


export default function IziDropdown(props){

    const [selectedCheckboxes,setSelectedCheckboxes] = useState([]) 

    const {locale} = useLanguage()
/*
    useEffect(() => {
        if(props.multiple && selectedCheckboxes.length){
            setSelectedCheckboxes([])
        }
    },[props.items])
*/
    useEffect(() => {

        if(props.multiple && props.items && Array.isArray(props.value)){
            const selected  = []
            props.items.forEach((item,key) => {
                if(props.value.some(el => el.id == item.id) && selected.findIndex(el => el == key)<0)
                    selected.push(key)
            })
            //_setValue(selected)
            setSelectedCheckboxes(selected)
        }

    },[props.value])

    
    const dropdown = useRef(null);
    if(props.value == null)
    dropdown?.current?.reset()

    let getStyle = ()=>{
        if(typeof props.style  ==="object"){
            style = {
                ...loginStyles.dropdown, ...props.style}
        }else{
            style = loginStyles.dropdown
        }
        if(props?.orientation == "horizontal"){
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
        const st = {...getStyle().button.label, 
            ...(props.disabled 
            ? {...getStyle().button.label.disabled , ...props.buttonTextStyleDisabled}
            : {...getStyle().button.label.enabled, ...props.buttonTextStyle}),
            textAlign:props?.textAlign || 'center'
        }

        return filterObject(st, ([key, value])=> ["enabled","disabled"].indexOf(key)<0)
    }

    const getDropdownTextStyle = ()=>{
        const st = {...getStyle().dropdown.label, 
            ...(props.disabled 
            ? {...getStyle().dropdown.label.disabled , ...props.dropdownTextStyleDisabled}
            : {...getStyle().dropdown.label.enabled, ...props.dropdownTextStyle})
        }

        return filterObject(st, ([key, value])=> ["enabled","disabled"].indexOf(key)<0)
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

    const _setValue=(val,unchecked)=>{
        //if(val>0)
            props.setValue(val,unchecked)
    }

    const onCheckChange = (index) => {
        const checkboxes = [...selectedCheckboxes]
        const i = checkboxes.indexOf(index)
        if(i === -1)
            checkboxes.push(index)
        else
            checkboxes.splice(i,1)
        _setValue(checkboxes.map(e => props.items[e]),i !== -1 && props.items[index] || null)
        setSelectedCheckboxes(checkboxes)
    }

    const getLabel = () => {
        if(props.multiple){
            if(selectedCheckboxes.length === 1 && props.items[selectedCheckboxes[0]])
                return props.items[selectedCheckboxes[0]].label
            else if(selectedCheckboxes.length)
                return selectedCheckboxes.length === props.items.length && props.allSelectionLabel || locale.formatString(locale._template.dropdown.nSelectedElements,{
                    items:selectedCheckboxes.length
                })
        }
        
        return props.placeholder
    }
    
    return(
        <View style={[getStyle()]} >
            <Text style={ getStyle().title }>{props.title}</Text>
            <View style={{alignItems:'stretch', flexDirection:'column', justifyContent:'center', flex:1}}>

                <SelectDropdown
                    ref={dropdown}
                    style={{flex:1}}
                    data={props.items}
                    defaultButtonText={getLabel()}
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
                        const DefaultTextTag = ({textAlign = 'center'}) => (
                            <Text
                            numberOfLines={1}
                            allowFontScaling={false}
                            style={{...{
                                flex: 1,
                                fontSize: 18,
                                textAlign,
                                maxWidth:props.multiple ? '80%' : '100%',
                                marginHorizontal: 8,},...getDropdownTextStyle(),...(index == props.items.indexOf(props.value) ? {color:colors.iziflo_blue} : {})}}
                            >
                                {text}
                            </Text>
                        )
                        if(props.multiple){
                            return (
                                <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',height:'100%'}} onPress={() => onCheckChange(index)}>
                                    <DefaultTextTag textAlign="left"/>
                                    <Checkbox selected={selectedCheckboxes.indexOf(index) !== -1} style={{marginRight:10}} rounded={false} onChange={() => onCheckChange(index)} />
                                </TouchableOpacity>
                            )
                        }
                        return (
                            <DefaultTextTag/>
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