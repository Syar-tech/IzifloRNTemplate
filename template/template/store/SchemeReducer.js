
export default (state = 'light', action) => {
    switch(action?.type){
        case 'dark':
        case 'light':
            return action.type
    }

    return state
}