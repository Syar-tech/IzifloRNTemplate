import { useSelector } from "react-redux";

export default (state = [], action) => {
    if(!action.id || !action.table) return state;
    switch(action?.type){
        case ACTIONS_TYPE.START_UPDATE:
            return [...state, {
                id:action.id,
                table:action.table,
                startDate:Date.now(),
            }]
        case ACTIONS_TYPE.STOP_UPDATE:
            return state.filter(e=>(!(e.id == action.id && e.table == action.table)))
    }
    return state
}

export const useIsUpdating = (...tables) => (useSelector(state=>tables.every(tbl => state._template.is_updating.some(e => e.table == tbl))))

export const ACTIONS_TYPE = {
    START_UPDATE:"startUpdate",
    STOP_UPDATE:"stopUpdate",
  }
