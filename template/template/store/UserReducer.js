export default (state=false, action) =>{
    switch(action.type){
        case "user.set": 
            return action.value
        case "user.pin.set": 
            if(state) return {...state, pin:action.value}
            else return false
        case "user.disconnect": 
            return false
        case "user.disconnect_with_data": 
        if(state) return {...state, disconnected:true}
        else return false
    }
    return state;
}
