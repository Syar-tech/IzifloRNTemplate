import {persistCombineReducers} from 'redux-persist'
import createSensitiveStorage from "redux-persist-sensitive-storage";
import NetworkStateReducer from './NetworkStateReducer'
import SchemeReducer from './SchemeReducer'
import UserReducer from './UserReducer'
import { __SInfoConfig } from '../Tools/Prefs';



const storage = createSensitiveStorage(__SInfoConfig);

const config = {
    key: "tpl",
    storage,
    blacklist:[]
  };


export default persistCombineReducers(config,{
    colorScheme:SchemeReducer,
    user:UserReducer,
    networkState:NetworkStateReducer,
})


export const ACTIONS_TYPE = {
    USER_SET:"user.set",
    USER_PIN_SET:"user.pin.set",
    USER_DISCONNECT:"user.disconnect",
    COLOR_SCHEME_DARK:"dark",
    COLOR_SCHEME_LIGHT:"light",
    NETWORK_STATE:"networkState"
  }