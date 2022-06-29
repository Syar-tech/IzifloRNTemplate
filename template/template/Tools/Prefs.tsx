
import SInfo,{RNSensitiveInfoOptions} from 'react-native-sensitive-info';
import Config from "react-native-config";
import { getBundleId } from "react-native-device-info";

const __keyChain = '#fL$G9=esb9^XBqN' + getBundleId();
const __PrefName = '_IziLoginPrefs.' + getBundleId();
export const __SInfoConfig : RNSensitiveInfoOptions= {
    sharedPreferencesName: __PrefName,
    keychainService: __keyChain
}
