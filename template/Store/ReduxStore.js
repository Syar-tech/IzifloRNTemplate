import {createStore, combineReducers} from 'redux'
import FilesystemStorage from 'redux-persist-filesystem-storage'
import { persistStore, persistReducer } from 'redux-persist';
import BaseReducer from '../template/store/BaseReducer'
import CommonDownReducer , {TABLE_ACTIONS} from '../template/store/CommonDownReducer'
import { ACTIONS_TYPE as BASE_ACTIONS } from '../template/store/BaseReducer';
import { configureStore } from '@reduxjs/toolkit';

const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    blacklist: ["_template"]
  };

export class IzifloWsTable{
  tablename = ""
  secondaryKeys = undefined
  extarnalTablename = undefined
  constructor (tablename, secondaryKeys = undefined, extarnalTablename = undefined){
    this.tablename = tablename
    this.secondaryKeys = secondaryKeys
    this.extarnalTablename = extarnalTablename || tablename
  }

  getReducer = ()=>{
    return CommonDownReducer(this.extarnalTablename, this.secondaryKeys)
  }
}

export const IZIFLO_WS_TABLE_LIST = [
]

const MainReducer = combineReducers({
    _template:BaseReducer,
    //add app specific reducers
    ... IZIFLO_WS_TABLE_LIST.reduce((obj, current)=>{
      obj[current.tablename] = current.getReducer()
      return obj
    },{})
})

const store = configureStore ({
  reducer:persistReducer(persistConfig, MainReducer),
  middleware:(getDefaultMiddleware ) =>getDefaultMiddleware({
    serializableCheck: false,
    immutableCheck: false,
  })
})

export default store
export const persistor = persistStore(store);


export const ACTIONS_TYPE = {
  ...BASE_ACTIONS,
  ...TABLE_ACTIONS,
  //add app specific actions
}
