//login.js main file  for locales
import { NativeModules, Platform } from 'react-native'
import LocalizedStrings from 'react-localization';
import en from './Locales/en';
import fr from './Locales/fr';
import {localeIdentifier} from "../template/Locales/locales"

const locale = new LocalizedStrings({
    en: en,
    fr: fr
})


locale.setLanguage(localeIdentifier.substring(0,2))
export default locale