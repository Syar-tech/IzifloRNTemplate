
import SInfo from 'react-native-sensitive-info';
import {__SInfoConfig} from '../Tools/Prefs';

export async function getToken(){
    let token = await SInfo.getItem("loginState", __SInfoConfig);
}


export const TOKEN_STATE = {
    VALID="VALID",
    INVALID="INVALID",
    BLOCKED="BLOCKED",
    OBSOLETE="OBSOLETE",
}