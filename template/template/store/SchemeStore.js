import {createStore, combineReducers} from 'redux'
import { storeScheme } from '../Tools/TokenTools'

const setScheme = (state = 'light', action) => {
    switch(action?.type){
        case 'dark':
        case 'light':
            storeScheme(action.type)
            return action.type
    }

    return state
}

const userUpdated = (state=0, action) =>{
    if(action.type == "newUser"){
        return state+1
    }
    return state;
}


const rootReducer= combineReducers({
    colorScheme:setScheme,
    userUpdatedCycle:userUpdated
})


export default createStore(rootReducer)