import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { View , Text, TouchableOpacity} from "react-native"
import { SvgXml } from 'react-native-svg'
import { useSelector, useStore } from 'react-redux'

import { colors } from '../../style/style'
import { useLanguage } from '../Locales/locales'

import icon_cancel from "../../res/img/icon_cancel";
import icon_synchronize from "../../res/img/icon_synchronize";
import SnackMessage, { COLORSET, HEIGHT,DEFAULT_STYLE, FlipView } from "../../template/Components/SnackMessage";
import {B, colors as templateColors} from '../../template/Styles/Styles'
import { saveDeliveryItems, signDelivery, validateDelivery } from '../../Api/LogisticApi'
import IziLoader from './IziLoader'
import { useNavigation } from '@react-navigation/native'
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated'
import { alphabeticallyCompare } from '../Tools/StringTools'
import { DELIVERY_ITEM_STATUS, DELIVERY_STATUS } from '../../Api/DeliveryStates'
import { icon_info } from '../../res/img/icon_info'
import icon_understand from '../../res/img/icon_understand'

export const PRESTA_SAVING_STATE = {
    SAVING:'saving',
    SAVED:'saved',
    ERROR:'error',
}

export const PRESTA_MESSAGE_STYLE = {
    SAVING:{
                    height:HEIGHT.LARGE,
                    colorset:COLORSET.ORANGE,
                },
    SAVED:{
                    height:HEIGHT.LARGE,
                    colorset:COLORSET.GREEN,
                },
    ERROR:{
                    height:HEIGHT.TWO_LINES,
                    colorset:COLORSET.RED,
                },
    NONE:{
                    height:HEIGHT.NONE,
                    colorset:COLORSET.DEFAULT,
                },
    DEFAULT:{
                    height:HEIGHT.SMALL,
                    colorset:COLORSET.DEFAULT,
                }
}


let prestaSaveTimeout = undefined;

export  const deliveryItemComparator = (a,b) => {
    let ret = 0
    if(a.del_contact_name && !b.del_contact_name)
        ret =  1
    else if(!a.del_contact_name && b.del_contact_name)
    ret = -1
    else if(!a.del_contact_name && !b.del_contact_name)
    ret = 0
    else
        ret = alphabeticallyCompare(a.del_contact_name?.toLowerCase(), b.del_contact_name?.toLowerCase())
    
    if(ret == 0)
    ret = alphabeticallyCompare(a.vin?.toLowerCase(), b.vin?.toLowerCase())


    return ret
}
export const prestaGetErrorMapping = (data, locale) => {
    let vins = data?.map(veh=>{
        reason = ""
        if(veh.delivery_status == DELIVERY_STATUS.DELIVERED || veh.item_status == DELIVERY_ITEM_STATUS.DELIVERED)
            reason = locale.PrestationScene.send_error_delivered
        else if(veh.delivery_status == DELIVERY_STATUS.VALIDATED)
            reason = locale.PrestationScene.send_error_validated
        else if(veh.delivery_status == DELIVERY_STATUS.PARTIALLY_SIGNED)
            reason = locale.PrestationScene.send_error_signed
        else if(veh.item_status == DELIVERY_ITEM_STATUS.TODO && veh.item_status == DELIVERY_ITEM_STATUS.ONGOING)
            reason = locale.PrestationScene.send_error_ready
        else if(veh.is_deleted == 1)
            reason = locale.PrestationScene.send_error_deleted
        else
            reason = locale.PrestationScene.send_error_modified

        return {title:veh.vin, right:reason}
    })
    return vins
}



/**-----------------------------
 * 
 *       Component
 * 
 ------------------------------*/
const PrestaSavingMessage = (
    {
        defaultMessage=undefined,
        onDeliveryModified=()=>{},
        onSaveStateChanged=(saveState)=>{}
    }, ref) => {

    useImperativeHandle(ref, ()=>({
            isSaving :() =>_isSaving(),
            save : async (items=[]) =>_save(items),
            validate : async (delivery) =>_validate(delivery),
            sendSignatures : async (delivery) =>_sendSignatures(delivery),
            /*showError : (text="", showMessage = false,showDate = false, buttons=undefined)=>{
                setDisplayMessage({title:text, message:showMessage ? locale.MainMenuScene.lastSyncMessage : undefined,date: showDate ? formatDateAndTimeForDisplay(new Date(lastSync), user.settings) : undefined, type:MESSAGE_TYPE.ERROR, buttons:buttons})
            },
            dismiss:(type = null)=>{
                if(!type || type == displayMessage?.type)
                    cancelMessage()
            }*/
        })   
    )

    const {locale} = useLanguage()
    const user = useSelector(state => state._template.user)

    const [savingState, setSavingState] = useState(undefined)
    const colorScheme = useSelector((state) => state._template.colorScheme);

    const navigation = useNavigation()
    const store = useStore()


    const _isSaving = ()=> savingState?.state == PRESTA_SAVING_STATE.SAVING


    useEffect(()=>{
        if(prestaSaveTimeout) clearTimeout(prestaSaveTimeout)
        if(!savingState?.dont_timeout){
            if(savingState?.state == PRESTA_SAVING_STATE.SAVED || savingState?.state ==PRESTA_SAVING_STATE.ERROR){
                prestaSaveTimeout = setTimeout(()=>{
                    closeMessage()
                }, 5000)
            }

        }
        onSaveStateChanged(savingState?.state, savingState?.id_delivery)
    },[savingState])
    
    const getMessageStyleType = ()=>{
        switch(savingState?.state){
            case PRESTA_SAVING_STATE.SAVING:
                return PRESTA_MESSAGE_STYLE.SAVING
            case PRESTA_SAVING_STATE.SAVED:
                return PRESTA_MESSAGE_STYLE.SAVED
            case PRESTA_SAVING_STATE.ERROR:
                return PRESTA_MESSAGE_STYLE.ERROR
            default:
                return defaultMessage ? PRESTA_MESSAGE_STYLE.DEFAULT : PRESTA_MESSAGE_STYLE.NONE
        }
        
    }
    
    const closeMessage = () => {
        setSavingState(false)
        prestaSaveTimeout=undefined
    }
    
        /**-----------------------------
         * 
         *       Saving
         * 
         ------------------------------*/

    const  _save = async (items)=>{
        const retry = () => {_save(items)}
        if(!savingState || savingState?.state != PRESTA_SAVING_STATE.SAVING && items.length>0){
            if(prestaSaveTimeout){
                clearTimeout(prestaSaveTimeout)
                prestaSaveTimeout = undefined
            }
            
            setSavingState({state:PRESTA_SAVING_STATE.SAVING})
            try{
                reps = await Promise.all(
                [ 
                        saveDeliveryItems(navigation, store, items),
                        new Promise(resolve => {
                            setTimeout(() => { resolve('') }, 2000);
                        })
                    ]
                )
                response = reps[0]
                if(response && typeof response == 'object'){
                    if(response.error){
                        switch(response.error.type){
                            case 'delivery_item_modified':
                            {
                                let vins = prestaGetErrorMapping(response.error?.data, locale)
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.PrestationScene.deliveryItemsModifiedOnWeb,
                                    onClose: onDeliveryModified,
                                    dont_timeout:true,
                                    button:{
                                        svg:icon_info,
                                        title:locale.PrestationScene.informations,
                                        onPress: () => {
                                            closeMessage()
                                            navigation.navigate('ErrorScene',{
                                                errorMessage:<><Text>{locale.PrestationScene.send_error_title_1}</Text><B>{locale.PrestationScene.send_error_title_2}</B><Text>{locale.PrestationScene.send_error_title_3}</Text></>,
                                                list:vins,
                                                icon:'warning',
                                                footerButtons:[
                                                {
                                                    image:icon_understand,
                                                    text:locale.PrestationScene.i_understand,
                                                    tint:colors.green
                                                }]
                                            })
                                        }
                                    }
                                })
                            }
                            break;
                            default:
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                    retry,
                                })
                            break
                        }
                    }else{
                        //TODO saved
                        setSavingState({state:PRESTA_SAVING_STATE.SAVED})
                    }
                    
                }else{
                    switch(response){
                        case 1:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendNetworkErrorTitle,
                                error_message:locale.PrestationScene.sendNetworkErrorMessage,
                                retry,
                            })
                        break;
                        default:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                retry,
                            })
                        break;
                    }
                }
            }catch(e){
                console.log(e) 
                setSavingState({
                    state:PRESTA_SAVING_STATE.ERROR,
                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                    retry,
                })
            }

        }
    }

    const  _validate = async (delivery)=>{
        const retry = () => {_validate(delivery)}
        if(!savingState || savingState?.state != PRESTA_SAVING_STATE.SAVING && delivery.delivery_items.length>0){
            if(prestaSaveTimeout){
                clearTimeout(prestaSaveTimeout)
                prestaSaveTimeout = undefined
            }
            
            setSavingState({state:PRESTA_SAVING_STATE.SAVING})
            try{
                reps = await Promise.all(
                    [           
                        validateDelivery(navigation, store, [delivery]),
                        new Promise(resolve => {
                            setTimeout(() => { resolve('') }, 2000);
                        })
                    ]
                )
                response = reps[0]

                if(response && typeof response == 'object'){
                    if(response.error){
                        switch(response.error.type){
                            case 'delivery_item_modified':
                            {
                                let vins = prestaGetErrorMapping(response.error?.data, locale)
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.DeliveryValidationScene.deliveryModifiedOnWeb,
                                    onClose:onDeliveryModified,
                                    dont_timeout:true,
                                    button:{
                                        svg:icon_info,
                                        title:locale.PrestationScene.informations,
                                        onPress: () => {
                                            closeMessage()
                                            navigation.navigate('ErrorScene',{
                                                errorMessage:<><Text>{locale.PrestationScene.send_error_title_1}</Text><B>{locale.PrestationScene.send_error_title_2}</B><Text>{locale.PrestationScene.send_error_title_3}</Text></>,
                                                list:vins,
                                                icon:'warning',
                                                footerButtons:[
                                                {
                                                    image:icon_understand,
                                                    text:locale.PrestationScene.i_understand,
                                                    tint:colors.green
                                                }]
                                            })
                                        }
                                    }
                                })
                            }
                            break;
                            default:
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                    retry
                                })
                            break
                        }
                    }else{
                        //TODO saved
                        setSavingState({state:PRESTA_SAVING_STATE.SAVED, id_delivery:response?.validatedDelivery})
                    }
                    
                }else{
                    switch(response){
                        case 1:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendNetworkErrorTitle,
                                error_message:locale.PrestationScene.sendNetworkErrorMessage,
                                retry
                            })
                        break;
                        default:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                retry
                            })
                        break;
                    }
                }
            }catch(e){
                console.log(e) 
                setSavingState({
                    state:PRESTA_SAVING_STATE.ERROR,
                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                    retry
                })
            }

        }
    }

    const  _sendSignatures = async (delivery)=>{
        const retry = () => {_sendSignatures(delivery)}
        if(!savingState || savingState?.state != PRESTA_SAVING_STATE.SAVING && delivery.delivery_items.length>0){
            if(prestaSaveTimeout){
                clearTimeout(prestaSaveTimeout)
                prestaSaveTimeout = undefined
            }
            
            setSavingState({state:PRESTA_SAVING_STATE.SAVING})
            try{
                reps = await Promise.all(
                [       
                        signDelivery(navigation, store, [delivery]),
                        new Promise(resolve => {
                            setTimeout(() => { resolve('') }, 2000);
                        })
                    ]
                )
                response = reps[0]
                if(response && typeof response == 'object'){
                    if(response.error){
                        switch(response.error.type){
                            case 'delivery_item_modified':
                            {
                                let vins = prestaGetErrorMapping(response.error?.data, locale)
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.DeliveryValidationScene.deliveryModifiedOnWeb,
                                    onClose:onDeliveryModified,
                                    retry,
                                    dont_timeout:true
                                })
                            }
                            break;
                            default:
                                setSavingState({
                                    state:PRESTA_SAVING_STATE.ERROR,
                                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                    retry
                                })
                            break
                        }
                    }else{
                        //TODO saved
                        setSavingState({state:PRESTA_SAVING_STATE.SAVED})
                    }
                    
                }else{
                    switch(response){
                        case 1:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendNetworkErrorTitle,
                                error_message:locale.PrestationScene.sendNetworkErrorMessage,
                                retry
                            })
                        break;
                        default:
                            setSavingState({
                                state:PRESTA_SAVING_STATE.ERROR,
                                error_title:locale.PrestationScene.sendUnknownErrorTitle,
                                error_message:locale.PrestationScene.sendUnknownErrorMessage,
                                retry
                            })
                        break;
                    }
                }
            }catch(e){
                console.log(e) 
                setSavingState({
                    state:PRESTA_SAVING_STATE.ERROR,
                    error_title:locale.PrestationScene.sendUnknownErrorTitle,
                    error_message:locale.PrestationScene.sendUnknownErrorMessage,
                })
            }

        }
    }
        /**-----------------------------
         * 
         *       UI
         * 
         ------------------------------*/
    const getMessage = ()=>{
    
        switch(savingState?.state){
            case PRESTA_SAVING_STATE.SAVING:
                return (
                    <View style={{width:'100%', alignItems:'center', paddingStart:30,paddingEnd:30, flexDirection:'row',}}>
                        <Text style={{fontWeight:'bold',fontSize:16, color:'white', flex:1}}>{locale.PrestationScene.sending}</Text>
                        <IziLoader color="white"/>
                    </View>
                )
            case PRESTA_SAVING_STATE.SAVED:
                return (
                    <View style={{width:'100%', alignItems:'center', paddingStart:30,paddingEnd:30, flexDirection:'row',}}>
                        <Text style={{fontWeight:'bold',fontSize:16, color:'white', flex:1}}>{locale.PrestationScene.saved}</Text>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}}onPress={()=>{closeMessage()}}>
                            <SvgXml xml={icon_cancel} fill="#FFF" height={16} width={16} />
                            <Text style={{marginStart:10,fontWeight:'normal',fontSize:16, color:'white', flex:0}}>{locale.Global.close}</Text>
                        </TouchableOpacity>
                    </View>
                )
            case PRESTA_SAVING_STATE.ERROR:
                return (
                    <View style={{width:'100%', alignItems:'center', paddingStart:10,paddingEnd:10, flexDirection:'row',}}>
                        <View style={{flex:1, flexDirection:'column'}}>
                            <Text style={{fontWeight:'bold',fontSize:14, color:'white'}}>{savingState.error_title}</Text>
                            {!!savingState.error_message && <Text style={{fontWeight:'normal',fontSize:14,marginTop:-2, color:'white'}}>{savingState.error_message}</Text>}
                        </View>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center'}} onPress={() =>{typeof savingState?.button?.onPress == 'function' ? savingState.button.onPress() :  (typeof savingState?.retry == 'function' ? savingState?.retry() : undefined)}}>
                            <SvgXml xml={savingState?.button?.svg ? savingState.button.svg : icon_synchronize} fill="#FFF" height={16} width={16} />
                            <Text style={{marginStart:3,fontWeight:'normal',fontSize:14, color:'white', flex:0}}>{savingState?.button?.title ? savingState?.button?.title : locale.Global.retry}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection:'row',alignItems:'center', marginStart:15}}onPress={()=>{if(savingState?.onClose && !savingState.onClose()) closeMessage()}}>
                            <SvgXml xml={icon_cancel} fill="#FFF" height={16} width={16} />
                            <Text style={{marginStart:3,fontWeight:'normal',fontSize:14, color:'white', flex:0}}>{locale.Global.close}</Text>
                        </TouchableOpacity>
                    </View>
                )
            default:
                /*if(typeof defaultMessage === 'object')
                    return (
                        <View>
                            {defaultMessage}
                        </View>
                    )*/
                if (!defaultMessage) return undefined 
                else
                return (
                    <Text style={{textAlign:'center',color:templateColors[colorScheme].textDefaultColor, paddingStart:10, paddingEnd:10}}>
                        {defaultMessage}
                    </Text>
                )
        }
    }
    return (
            <SnackMessage styleType={getMessageStyleType()}>
                {getMessage()}
            </SnackMessage>
    )
    
}

const styles = {
    scanTypes:{
        error:{
            backgroundColor:colors.lightRed,
            borderColor:colors.red,
        },
        last_sync:{
            backgroundColor:colors.lightGreen,
            borderColor:colors.green,
        },
        warning:{
            backgroundColor:colors.lightOrange,
            borderColor:colors.orange,
        },
        text_error:{
            color:colors.red,
        },
        text_last_sync:{
            color:colors.green,
        },
        text_warning:{
            color:colors.orange,
        },

    },
    title:{
         color:'white',
         fontWeight:'bold', 
         fontSize:14,
         flex:1,
    },
    message:{
         color:'white',
         fontSize:14,
    },
    date:{
         color:'white',
         fontSize:14,
         marginStart:10,
    }
}


export default React.forwardRef(PrestaSavingMessage)