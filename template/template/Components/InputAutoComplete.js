import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import {TouchableOpacity, StyleSheet, View,Text, TextInput, ScrollView, Keyboard, useColorScheme, TouchableWithoutFeedback} from 'react-native'
import { SvgXml } from 'react-native-svg'
import icon_cancel from '../res/img/icon_cancel'
import { colors } from '../../styles/styles'

export default React.forwardRef(function InputAutoComplete({
    values = [],
    placeholder="",
    style={},
    inputStyle={},
    borderRadius=20,
    placeholderTextColor=null,
    initialValue="",
    selectTextOnFocus = false,
    onTextChange = () => {},
    useTags=false,
    defaultTags=[],
    unique=false,
    rule=null,
    onTagChange=()=>{},
    keyboardType="default",
    autoCapitalize="sentences",
    backgroundColor=null,
    textColor=null,
    fontSize=16,
    tagsStyle={
        textColor:null,
        backgroundColor:null
    }
},ref){

    useImperativeHandle(ref, ()=>({
        reset: (openDropDown = true)=>{
            onChangeText('', openDropDown)
        },
        setValue: (value, openDropDown = false)=>{
            onChangeText(value, openDropDown)
            
        }
    }))

    const colorScheme = useColorScheme()

    const inputRef = useRef()

    const [autocomplete,setAutocomplete] = useState([])

    const [currentValue,setCurrentValue] = useState(initialValue || '')

    const [tags,setTags] = useState([])

    const [textFocused, setTextFocused] = useState(false)

    useEffect(() => {
        if(defaultTags){
            const t = [...tags]
            if(Array.isArray(defaultTags)){
                defaultTags?.forEach(tag => {
                    if(!t.some(e => e === tag)){
                        t.push({label:tag})
                    }
                })
            }else if(!t.some(e => e === defaultTags)){
                t.push({label:defaultTags})
            }
            typeof onTagChange === 'function' && onTagChange(t.map(tag => tag.label))
            setTags(t)
        }

    },[])

    const onAutocompleteItemPress = item => {
        setAutocomplete([])
        if(useTags){
            let t = [...tags]
            t.push({label:item.label})
            t = t.map(item => ({...item, selected:false}))
            setTags(t)
            setCurrentValue('')
            onTextChange(tags)
            typeof onTagChange === 'function' && onTagChange(t.map(tag => tag.label))
            return
        }
        setCurrentValue(item.label)
        onTextChange(item.label)
        Keyboard.dismiss()
    }

    const onRemoveTag = index => {
        console.log("onremovetag")
        const t = [...tags]
        t.splice(index,1)
        setTags(t)
        typeof onTagChange === 'function' && onTagChange(t.map(tag => tag.label))
    }

    const onChangeText = (text, showDropdown = true)=> {
        if(currentValue != text){
            setCurrentValue(text)
            onTextChange(text)
        }
        const v = [...values]
        const i = v.findIndex(e => !e.id)
        let isValid = true
        if(unique && tags.findIndex(t => t.label == text) !== -1){
            isValid = false
        }
        if(typeof rule === 'function'){
            isValid = rule(text)
        }
        if(i !== -1)
            v.splice(i,1)

        if(text){
            v.push({
                id:null,
                name:text,
                label:text,
                valid:isValid
            })
        }
        if(showDropdown) setAutocomplete(v.filter(e => e.label.toLowerCase().indexOf(text.toLowerCase()) !== -1))
        else setAutocomplete([])
    }

    const onKeyPressed = (event)=>{
        if(event?.nativeEvent?.key =='Backspace' && !currentValue && tags.length >0){
            let t = [...tags]
            let latest =  t[t.length-1]
            if(latest.selected){
                t.pop()
            }else{
                t = t.map((tag, index)=>{
                    return {...tag, selected : index == t.length -1}
                })
            }
            setTags(t)
        }
    }

    return (
        <View style={style}>
            <View style={[styles.inputLike, inputStyle, backgroundColor ? {backgroundColor} : {}, {textAlignVertical:'center',borderBottomRightRadius:autocomplete.length ? 0 : borderRadius,borderBottomLeftRadius:autocomplete.length ? 0 : borderRadius,borderTopRightRadius:borderRadius, borderTopLeftRadius:borderRadius} ]}>
                
                <TouchableWithoutFeedback style={{width:'100%'}}  onPress={()=>inputRef?.current?.focus()}>
                    <View style={styles.tagsContainer}>
                    {tags.map((tag,k) => (
                        <View style={[styles.tag,{zIndex:100, backgroundColor:tag.selected ? "gray" : (tagsStyle.backgroundColor ||colors.iziflo_back_blue)}]} key={k}>
                            <TouchableOpacity style={{zIndex:101,padding:5 }} onPress={() => onRemoveTag(k)}>
                                <SvgXml xml={icon_cancel} fill={tagsStyle.textColor || colors.iziflo_dark_gray} height={10} width={10} />
                            </TouchableOpacity>
                            <Text style={{color:tagsStyle.textColor || colors.iziflo_dark_gray}}>
                                {tag.label}
                            </Text>
                        </View>
                    ))}
                    </View>
                </TouchableWithoutFeedback>
                
                <TextInput
                    selectTextOnFocus={selectTextOnFocus}
                    onChangeText={onChangeText}
                    value={currentValue} 
                    onFocus={()=>{setTextFocused(true)}}
                    onBlur={() => {setTextFocused(false); setAutocomplete([])}}
                    keyboardType={keyboardType? keyboardType : 'default'}
                    placeholder={!tags.length ? placeholder : ''}
                    placeholderTextColor={placeholderTextColor}
                    autoCapitalize={autoCapitalize ? autoCapitalize : "sentences"}
                    ref={inputRef}
                    onKeyPress={onKeyPressed}
                    style={{paddingBottom:tags?.length ? 5 : 0, height: !useTags || textFocused || !tags?.length? 'auto' : 0, color:textColor || colors.iziflo_dark_gray, fontSize:fontSize}}
                />
                
            </View>
            {!!autocomplete.length && textFocused && <View focusable={false} style={[{maxHeight:150,minHeight:30},styles.flatListContainer,{backgroundColor : backgroundColor || 'white'}]}>
                <ScrollView  keyboardShouldPersistTaps='handled' nestedScrollEnabled={true} style={{width:'100%',minHeight:30,maxHeight:150,marginTop:-1,zIndex:6}} scrollEnabled={true}>
                    {autocomplete.map(item => (
                        <>
                            {(item.valid || (!unique && !rule)) &&
                                <TouchableOpacity  style={{height:35,justifyContent:'center',alignItems:'center', borderTopWidth:1, borderColor:'lightgray',}} key={item.id} onPress={() => onAutocompleteItemPress(item)}>
                                    <Text focusable={false} style={{color:tagsStyle.textColor || colors.iziflo_dark_gray}}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            }
                           {(!item.valid && (unique || rule)) &&
                                <View  style={{height:35,justifyContent:'center',alignItems:'center', borderTopWidth:1, borderColor:'lightgray'}} key={item.id} onPress={() => onAutocompleteItemPress(item)}>
                                    <Text style={{color:colors.red}}>
                                        {item.label}
                                    </Text>
                                </View>
                            }
                        </>
                    ))}
                </ScrollView>
            </View>}
        </View>
    )
})

const styles = StyleSheet.create({
    flatListContainer:{
        backgroundColor:'white',
        width:'100%',
        borderColor:'gray', 
        borderWidth:1, 
        borderTopWidth:0, 
        borderBottomEndRadius:25, 
        borderBottomStartRadius:25
    },
    inputLike:{
        width:'100%',
        backgroundColor:'white',
        minHeight:40,
        //padding:5,
        paddingLeft:10,
        borderRadius:20,
        marginTop:5,
        color:'black',
        justifyContent:'center',
        borderColor:colors.iziflo_blue, 
        borderWidth:1
    },
    tag:{
        borderRadius:15,
        padding:5,
        backgroundColor:colors.iziflo_back_blue,
        borderColor:colors.iziflo_blue,
        borderWidth:1,
        flexDirection:'row',
        alignItems:'center',
        marginRight:5,
        marginTop:5
    },
    tagsContainer:{
        flexDirection:'row',
        width:'100%',
        flexWrap:'wrap',
        backgroundColor:'transparent',
    }
})