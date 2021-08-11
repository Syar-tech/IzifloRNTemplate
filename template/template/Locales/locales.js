//main file  for locales
import { NativeModules, Platform } from 'react-native'
import LocalizedStrings from 'react-localization';
import en_tpl from './Locales/en';
import fr_tpl from './Locales/fr';
import en from '../../Locales/en';
import fr from '../../Locales/fr';
import { useEffect, useState } from 'react';
import { getStoredUser } from '../Tools/TokenTools';
import { getNumberSettings } from './number';

const locale = new LocalizedStrings({
    en: {...en_tpl,...en},
    fr: {...fr_tpl,...fr}
})

export function useUserAndLanguage() {

    const [user,setUser] = useState(null)
    useEffect(() => {
        getStoredUser().then(user => {
            setUser(user)
            locale.setLanguage(getLocaleIdentifier(user).substring(0,2)
        })
    },[])

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

    return {
        locale,
        user,
        localeIdentifier:getLocaleIdentifier(),
        numberSettings:getNumberSettings(getLocaleIdentifier()),
    }
}