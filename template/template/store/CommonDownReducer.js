import { getDate } from "date-fns";
import { useSelector } from "react-redux";
import { formatDateToYmdHs } from "../Tools/StringTools";
import { ACTIONS_TYPE } from "./BaseReducer";


export default function(tableName, secondaryKeys = [], flagModificationFromParents= false){
    if(!secondaryKeys?.length)console.log(tableName + " / secondary keys must be supplied to save local data") 

    return (state = DEFAULT_DATA , action) => {
        switch(action?.type){
            //-----------------
            //UPDATE LIST FROM WEB
            //-----------------
            case tableName+TABLE_ACTIONS.TABLE_SET:

            //function to identify if a localData has been updated on web
            const localIsModified = (localData, newDatas) => {

                const ret = newDatas.some(
                    distantData=>{
                        let exists = !!localData.id && !!distantData.id && localData.id == distantData.id;
                        if( exists) return !localData.ts || localData.ts < distantData.ts;

                        exists = (!localData.ts || localData.ts < distantData.ts) && dataMatchSecondaryKeys(localData, distantData, secondaryKeys)
                        
                        return exists
                    })

                    return ret
            }
            //remove modification on updated items
            let updated  = state.local_data?.filter(localData =>{
                
                let shouldRemove = !localData || localIsModified(localData, action.value)
                                    ||(localData.id && !action.value.some(value=> localData.id == value.id)) // remove every local with id which is not in distant data (ie, has been deleted)
                
                return !shouldRemove
            });
            
            if(flagModificationFromParents){
                //look for parents items (ie created, updated and deleted from parents)
                updated = updated.map(localData=>{
                    if(!localData.areParentsModified)
                        localData.areParentsModified = 
                            (localData._toCreate && localData._toCreate.some(createData => localIsModified(createData, action.value))) // don't look in created, because cannot correspond to web data
                            || (localData._toUpdate && localData._toUpdate.some(updateData => localIsModified(updateData, action.value)))
                            || (localData._toDelete && localData._toDelete.some(deleteData => localIsModified(deleteData, action.value)))
                    return localData
                    
                })

                
                if(tableName === 'shipments'){
                    state.local_data?.map(localData => {
                        let isDeleted = localData._toDelete?.some(toDelete => {
                            return !action.value.some(e => e?.id === toDelete?.id)
                        })
                        if(!isDeleted && localData?.id)
                            isDeleted = !action.value.some(e => e?.id === localData?.id)
        
                        localData.areParentsDeleted = isDeleted
                        return localData
                    })
                }

            }

            return {
                data: action.value ? action.value : DEFAULT_DATA.data,
                local_data:(updated ? updated : DEFAULT_DATA.local_data),
                ts:action.ts === undefined ? DEFAULT_DATA.ts : action.ts,
                i_id:action.i_id ? action.i_id : DEFAULT_DATA.i_id,
                secondaryKeys:secondaryKeys,
                lastTableSet:Date.now()
            }
            
                //-----------------
                //UPDATE LOCAL ITEM
                //-----------------
            case tableName+TABLE_ACTIONS.UPDATE_LOCAL:{
                console.log("update local")
                    if(!secondaryKeys?.length){
                        console.log("Error saving in "+ tableName +": No key supplied for local data ", JSON.stringify(action));
                        return state
                    }
                    if(!action.value){
                        console.log("Error saving in "+ tableName +": No value supplied");
                        return state
                    }
                    const values = !Array.isArray(action.value) ? [action.value] : action.value;
                    let updated = [...state.local_data];
                    values.forEach(item => {
                        item._last_saved_at = formatDateToYmdHs(new Date(), false)
                        const localIndex = state.local_data.findIndex(localData =>{
                            let exists = !!localData.id && !!item.id && localData.id == item.id;
                            if(exists)
                                return true
                            return dataMatchSecondaryKeys(localData, item, secondaryKeys)
                        })
                        const serverIndex = state.data.findIndex(el =>{
                            return (!!item.id && item.id === el.id) || (secondaryKeys.every(key => el[key] && item[key] && el[key] == item[key] ))
                        })
                        if(serverIndex >= 0){
                            const servData = state.data[serverIndex]
                            item.ts = (state.data[serverIndex] ? ""+(parseInt(servData.ts) + 1) : "-1")
                        }
                        if(localIndex >= 0){
                            updated.splice(localIndex, 1, item)
                        }else{
                            updated.push(item)
                        }
                    });

                return {
                    ...state,
                    local_data:(updated ? updated : DEFAULT_DATA.local_data),
                }}
            //-----------------
            //DELETE LOCAL ITEM
            //-----------------
            case tableName+TABLE_ACTIONS.DELETE_LOCAL:{

                    if(!secondaryKeys?.length){
                        console.log("Error saving in "+ tableName +": No key supplied for local data ", JSON.stringify(action));
                        return state
                    }
                    if(!action.value){
                        console.log("Error saving in "+ tableName +": No value supplied");
                        return state
                    }
                    const values = !Array.isArray(action.value) ? [action.value] : action.value;
                    let updated = [...state.local_data];
                    //console.log('UPDATED',updated.length)
                    values.forEach(item => {
                        const localIndex = state.local_data.findIndex(el =>{
                            return dataMatchSecondaryKeys(el, item, secondaryKeys)
                        })
                        const serverIndex = state.data.findIndex(el =>{
                            return secondaryKeys.every(key => el[key] && item[key] && el[key] == item[key] )
                        })
                        let existsOnServer = serverIndex >= 0;
                        //console.log(updated[localIndex])
                        if(localIndex >= 0){
                            //, {...state.local_data[localIndex], isDeleted:true}
                            if(existsOnServer)
                                updated.splice(localIndex, 1, {...state.local_data[localIndex], isDeleted:true})    
                            else
                                updated.splice(localIndex, 1)
                        }else{
                            console.log("deleting non existing item : "+tableName)
                        }
                    });

                return {
                    ...state,
                    local_data:(updated ? updated : DEFAULT_DATA.local_data),
                }}

            //-----------------
            //Reset or disconnect
            //-----------------
            case ACTIONS_TYPE.USER_DISCONNECT:
            case TABLE_ACTIONS.CLEAR_ALL_CACHE:
                return {...DEFAULT_DATA, secondaryKeys:secondaryKeys}
        }
        return state
    }
}

const dataMatchSecondaryKeys = (el1, el2 , secondaryKeys)=>{
    return secondaryKeys && !secondaryKeys.some(key => !el1[key] || !el2[key] || el1[key] != el2[key]) // some return true if one secondary does not correspond => exists  = ! some(...)
}

export const useDataWithLocal = (tableName, transformFun = (tableArray)=>{return tableArray}) => {
    
    const table =  useSelector((state)=>{
        const data = state[tableName];
        
        let tbl = []
        if(!data) {
            console.log("table unknown : ",tableName)
            return 
        }
        if(data.data){
             tbl = data.data.filter(el=> !data.local_data.some(el2 => el.id === el2.id || dataMatchSecondaryKeys(el, el2, state.secondaryKeys)))
            tbl.push(...data.local_data);
        }
        if(transformFun){
            tbl =  transformFun(tbl)
        }
        tbl = tbl ? tbl : [];
        return tbl;
    })
    return table
}

export const useDistantDataOnly = (tableName, transformFun = (tableArray)=>{return tableArray}) => {
    
    const table =  useSelector((state)=>{
        const data = state[tableName];
        
        let tbl = [...(!!data.data ? data.data :[])]
        
        if(transformFun){
            tbl =  transformFun(tbl)
        }
        tbl = tbl ? tbl : [];
        return tbl;
    })
    
    return table
}

export const useModifiedDataOnly = (tableName, transformFun = (tableArray)=>{return tableArray}) => {
    
    const table =  useSelector((state)=>{
        const data = state[tableName];

        let tbl = [...(!!data.local_data ? data.local_data :[])]
        if(transformFun){
            tbl =  transformFun(tbl)
        }
        tbl = tbl ? tbl : [];
        return tbl;
    })
    
    return table
}


const DEFAULT_DATA={ data: [],local_data: [],ts:-1,i_id:0, secondaryKeys:[],lastTableSet:0}


export const TABLE_ACTIONS = {
    TABLE_SET:".set",
    UPDATE_LOCAL:".local",
    DELETE_LOCAL:".delete_l",
    CLEAR_ALL_CACHE:"resetCache",
  }