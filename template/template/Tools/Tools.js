import { NativeModules, Platform } from "react-native";
import VersionCheck from 'react-native-version-check'

export async function getVersionCheckName(){
    console.log(NativeModules)
    if(Platform.OS === 'android' )
        return await NativeModules.IzifloCommonModule.getVersionCheckName()
    else return VersionCheck.getPackageName()
}