//main file  for locales
import { NativeModules, Platform } from 'react-native'
import LocalizedStrings from 'react-localization';
import en from './Locales/en';
import fr from './Locales/fr';

const locale = new LocalizedStrings({
    en: en,
    fr: fr
})

export const setLanguage = language => {
    let newLanguage = 'fr'
    if(language.substring(0,2) === 'en')
        newLanguage = 'en'
    locale.setLanguage(newLanguage)
}

let localeStr = "fr_FR"
if(Platform.OS === 'ios'){
    // iOS:
    localeStr = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // "fr_FR"
}else if (Platform.OS === 'android'){
    // Android:
    localeStr = NativeModules.I18nManager.localeIdentifier // "fr_FR"
}
locale.setLanguage(localeStr.substring(0,2))

export {localeStr as localeIdentifier}

export default locale