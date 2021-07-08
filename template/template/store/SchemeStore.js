import {createStore} from 'redux'
import { storeScheme } from '../Tools/TokenTools'

const setScheme = (state = {colorScheme:'dark'}, action) => {
    switch(action.type){
        case 'dark':
        case 'light':
            storeScheme(action.type)
            return {...state,colorScheme:action.type}
    }

    return state
}

export default createStore(setScheme)