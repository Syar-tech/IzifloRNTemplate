//main file  for locales

import * as React from 'react';
import { NativeModules, Platform } from 'react-native'
import LocalizedStrings from 'react-localization';
import en_tpl from './Locales/en';
import fr_tpl from './Locales/fr';
import en from '../../Locales/en';
import fr from '../../Locales/fr';
import { useEffect, useState } from 'react';
import { getNumberSettings } from './number';
import { useIsFocused } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';


export function useLanguage(withFocus=true) {

    
    const locale = new LocalizedStrings({
        fr: {...fr_tpl,...fr},
        en: {...en_tpl,...en},
    })



    const user = useSelector(state => {return state._template.user ? state._template.user : undefined})

    const isFocused = !withFocus ? true : useIsFocused()

    useEffect(() => {
        if(isFocused){
                locale.setLanguage(getLocaleIdentifier(user).substring(0,2))
                setLocaleTools(setLocaleToTools(locale, user))
        }
        setCrashlyticsAttributes()
    },[isFocused, user])

    const getLocaleIdentifier = (usr = user) => {

        if(usr?.settings?.language)
            return usr.settings.language

        let localeStr = "fr_FR"
        if(Platform.OS === 'ios'){
            // iOS:
            localeStr = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // "fr_FR"
        }else if (Platform.OS === 'android'){
            // Android:
            localeStr = NativeModules.I18nManager.localeIdentifier // "fr_FR"
        }
        return localeStr
    }

    const setCrashlyticsAttributes = ()=>{
        //user id
        if(user?.email){
            try{
                crashlytics()?.setUserId(user.email.substring(0,user.email.indexOf("@")))
            }catch(e){
                crashlytics()?.setUserId(user.email)
            }
        }else 
            crashlytics()?.setUserId("")
        
            //server and instance
            if(user?.server?.url)
                crashlytics().setAttribute("server",user.server.url)
            else
                crashlytics().setAttribute("server","")
            if(user?.server?.instance?.id_instance)
                crashlytics().setAttribute("instance",user.server.instance.id_instance)
            else
                crashlytics().setAttribute("instance","")

    }

    //-----------Tools


    const setLocaleToTools = (locale, usr=user)=>{
        return {
            locale,
            localeIdentifier:getLocaleIdentifier(usr),
            numberSettings:getNumberSettings(getLocaleIdentifier(usr)),
        }
    }
    const [localeTools, setLocaleTools] = useState(setLocaleToTools(locale))

    return localeTools
}
