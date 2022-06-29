

export default function(){

    return (state = [], action) => {
        switch(action?.type){
            case 'networkState':
                return action.value
        }
        return state
    }
}