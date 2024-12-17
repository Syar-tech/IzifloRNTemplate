import React ,{useState, useEffect, useRef} from 'react'
import {
    View,
    Text,
    TouchableOpacity
} from 'react-native'
import { loginStyles, colors, sizes ,filterObject} from '../Styles/Styles'
import SelectDropdown from 'react-native-select-dropdown'
import Icon from 'react-native-vector-icons/Ionicons'
import Checkbox from '../Components/Checkbox'
import { useLanguage } from '../Locales/locales'
import { useSelector } from 'react-redux'

const INDEX_SELECT_ALL = 0 // Do not update without updating the effective index of the item with ID 'SelectAll'

export default function IziDropdown(props){

    const [selectedCheckboxes,setSelectedCheckboxes] = useState([]) 

    const {locale} = useLanguage()
    const colorScheme = useSelector((state) => state._template.colorScheme);

    const [items, setItems] = useState([...(props.multiple && props.hasSelectAll && Array.isArray(props.items) && props.items.length ? [{label: locale._template.dropdown.selectAll, selected: false, id: 'SelectAll'}] : []), ...props.items] || [])
/*
    useEffect(() => {
        if(props.multiple && selectedCheckboxes.length){
            setSelectedCheckboxes([])
        }
    },[props.items])
*/

    useEffect(() => {
        if (props.multiple && props.hasSelectAll && Array.isArray(props.items)) {
            setItems([{label: locale._template.dropdown.selectAll, selected: false, id: 'SelectAll'}, ...props.items])
        } else {
            setItems(props.items || [])
        }
    }, [props.items])

    useEffect(() => {
        if(props.multiple && items && Array.isArray(props.value)){
            const selected  = []
            items.forEach((item,key) => {
                if(props.value.some(el => el.id == item.id) && selected.findIndex(el => el == key)<0)
                    selected.push(key)
            })

            if (props.hasSelectAll) {
                toggleSelectAll(selected)
            }

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

    const getDropdownSubTextStyle = ()=>{
        const st = {...getStyle().dropdown.sublabel, 
            ...(props.disabled 
            ? {...getStyle().dropdown.sublabel.disabled , ...props.dropdownSubTextStyleDisabled}
            : {...getStyle().dropdown.sublabel.enabled, ...props.dropdownSubTextStyle})
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

    const toggleSelectAll = (checkboxes) => {
        // Toggle 'selected' for id: 'SelectAll'
        if (checkboxes.findIndex(i => i === INDEX_SELECT_ALL) === -1) { // id: 'SelectAll' not yet selected
            if (items.length - 1 === checkboxes.length) { // All other elements are selected
                checkboxes.unshift(INDEX_SELECT_ALL)
            }
        } else { // id: 'SelectAll' is selected
            checkboxes.shift()
        }
    }

    /*---------------------------
    -
    -         Display
    -
    ----------------------------*/

    const _setValue=(val,unchecked)=>{
        //if(val>0)
            props.setValue(val,unchecked)
    }

    const onCheckChange = (index, item) => {
        const checkboxes = [...selectedCheckboxes]
        const i = checkboxes.indexOf(index)
        if (props.hasSelectAll && item?.id === 'SelectAll') {
            checkboxes.length = 0 // Empty the array to prevent duplicates
            if (i === -1) {
                for (let i = 1; i < items.length; i++) checkboxes.push(i);
            }
        } else {
            if(i === -1)
                checkboxes.push(index)
            else
                checkboxes.splice(i,1)
        }

        _setValue(checkboxes.filter(e => items[e].id !== 'SelectAll').map(e => items[e]),i !== -1 && items[index] || null)

        if (props.hasSelectAll) {
            toggleSelectAll(checkboxes)
        }

        setSelectedCheckboxes(checkboxes)
    }

    const getLabel = () => {
        if(props.multiple){
            if(selectedCheckboxes.length === 1 && items[selectedCheckboxes[0]])
                return items[selectedCheckboxes[0]].label
            else if(selectedCheckboxes.length)
                return selectedCheckboxes.length === items.length && props.allSelectionLabel || locale.formatString(locale._template.dropdown.nSelectedElements,{
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
                    style={{flex:1, width:"100%"}}
                    data={items}
                    defaultButtonText={getLabel()}
                    defaultValue={props.value}
                    onSelect={(selectedItem, index) => {
                    _setValue(selectedItem)
                    }}
                    disabled={props.disabled}

                    buttonTextAfterSelection={(selectedItem, index) => {
                        return (selectedItem.shortlabel ? selectedItem.shortlabel : selectedItem.label )
                        + (!!selectedItem.sublabel ? " - " + selectedItem.sublabel : "");
                    }}
                    buttonStyle={{...getButtonStyle(), width:'100%'}}
                    buttonTextStyle={getButtonTextStyle()}
                    renderDropdownIcon={() => {
                        return  (props.showArrow 
                            ? (props.renderDropdownIcon ? props.renderDropdownIcon() : <Icon style={getStyle().secureImage} name={props.dropdownArrowIcon || "caret-down-outline"} size={sizes.password.image.height} color={props.disabled ? getDropDownStyle().arrowColor || colors.lightGray : getDropDownStyle().arrowColor || colors.iziflo_blue}/> )
                           : undefined)
                        ;
                    }}
                    dropdownIconPosition={"right"}
                    dropdownStyle={getDropDownStyle()}
                    rowTextStyle={getDropdownTextStyle()}
                    renderCustomizedRowChild={(text, index)=>{
                        const DefaultTextTag = ({textAlign = 'center'}) => (
                            <View
                            style={{
                                flex:1,
                                flexDirection:'column',
                                marginHorizontal: 8,
                                justifyContent: 'center'
                            }}>
                            <Text
                            numberOfLines={1}
                            allowFontScaling={false}
                            style={{...{
                                flex: 1,
                                fontSize: 18,
                                textAlign,
                                maxWidth:props.multiple ? '80%' : '100%',
                               },
                               ...getDropdownTextStyle(),
                               ...(index == items.indexOf(props.value) ? {color:colors.iziflo_blue} : {}),
                               ...(props.hasSelectAll && index === INDEX_SELECT_ALL ? {color: colors[colorScheme].textGray} : {})
                            }}
                            >
                                {text.label}
                            </Text>
                            {!!text.sublabel && 
                            <Text
                            numberOfLines={1}
                            allowFontScaling={false}
                            style={{...{
                                flex: 1,
                                fontSize: 18,
                                textAlign,
                                maxWidth:props.multiple ? '80%' : '100%',
                            },
                            ...getDropdownSubTextStyle(),
                            ...(index == props.items.indexOf(props.value) ? {color:colors.iziflo_blue} : {}),
                            ...(props.hasSelectAll && index === INDEX_SELECT_ALL ? {color: colors[colorScheme].textGray} : {})
                        }}
                            >
                                {text.sublabel}
                            </Text>}
                            </View>
                        )
                        if(props.multiple){
                            return (
                                <TouchableOpacity style={{flexDirection:'row',justifyContent:'space-between',height:'100%'}} onPress={() => onCheckChange(index, text)}>
                                    <DefaultTextTag textAlign="left"/>
                                    <Checkbox selected={selectedCheckboxes.indexOf(index) !== -1} indeterminate={props.hasSelectAll && index === INDEX_SELECT_ALL && selectedCheckboxes.length > 0 && selectedCheckboxes.indexOf(INDEX_SELECT_ALL) === -1} style={{marginRight:10}} rounded={false} onChange={() => onCheckChange(index, text)} />
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