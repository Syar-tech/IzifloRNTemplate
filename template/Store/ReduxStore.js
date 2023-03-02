import {createStore, combineReducers} from 'redux'
import FilesystemStorage from 'redux-persist-filesystem-storage'
import { persistStore, persistReducer } from 'redux-persist';
import BaseReducer from '../template/store/BaseReducer'
import CommonDownReducer , {TABLE_ACTIONS} from '../template/store/CommonDownReducer'
import { ACTIONS_TYPE as BASE_ACTIONS } from '../template/store/BaseReducer';

const persistConfig = {
    key: 'root',
    storage: FilesystemStorage,
    blacklist: ["_template"]
  };

const MainReducer = combineReducers({
    _template:BaseReducer,
    //add app specific reducers
})
const store = createStore (persistReducer(persistConfig, MainReducer))
export default store
export const persistor = persistStore(store);


export const ACTIONS_TYPE = {
  ...BASE_ACTIONS,
  ...TABLE_ACTIONS,
  //add app specific actions
}
