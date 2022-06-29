
import {izi_api_app_code,izi_api_app_api_version} from "../../config/iziConfig"
import {getStoredUser, getCommonParams, TOKEN_STATE, generateRandomKey} from "../Tools/TokenTools"
import { checkToken} from "./LoginApi";
import Config from "react-native-config";
import { getUniqueId } from "react-native-device-info";
import NetInfo from "@react-native-community/netinfo";
import { ACTIONS_TYPE } from "../Store/ReduxStore";
import { queryWS } from "../template/API/WSApi";
import crashlytics from '@react-native-firebase/crashlytics'

//Api Object for post|get promises
//Api::post(url,data) || Api::get(url,data)

 export const Api = function(method, url, data, headers = {}){
    let body = '?'
    for(const prop in data)
        if(data.hasOwnProperty(prop)){
            if(body.length == 0)
                body +='?'
            else body += '&'
            body+=`${prop}=${encodeURIComponent(data[prop])}`
        }
    const request = {
        method: method.toUpperCase(),
        credentials: Api.credentials,
        headers: Object.assign({}, Api.headers, headers)
    };
    if(method.toLowerCase() === 'get'){
        url+=body
    }
    else
        request.body = body
    
    return fetch(url, request).then(res => res.ok ? res : Promise.reject(res))
};
(function(){
    Api.credentials = 'same-origin';
    Api.headers = {
        'Accept': 'application/json;application/pdf',
        'Content-Type':'application/x-www-form-urlencoded'
    };
    ['get', 'post'].forEach(method => {
        Api[method] = Api.bind(null, method);
    });
})();

export function getWSBaseUrl(server){
    return server.url+`/mobile_ws.php`
}

export const queryWS = async (navigation,store, params) => {
    if (!store){
        return Promise.reject("Store is null")
    }

    user = store.getState()._template.user
    try{
        //check token
        return checkToken(user, navigation, store)
        .then(
            async (data)=>{
                let usr = undefined;
                if(data && data.token && data.token.access_token != user.token.token){
                    console.log("token has been replaced"); 
                    //user updated and should be reloaded 
                    usr = store.getState()._template.user
                }else  usr = user
                let commonParams = await getCommonParams(usr)

                let wsQueryParams = {
                    module_name : izi_api_app_code,
                    module_version : izi_api_app_api_version
                }
                return Api.post(getWSBaseUrl(usr.server),{...commonParams, ...wsQueryParams, ...params})
                    .then(async (response) =>{/*console.log(await response.text())*/return params?.text ? response.text() : response.json()}).catch(e => console.log('ERROR FETCHING DATA',e.message, e))
            }
        ).catch(e => console.log('ERROR TOKEN ',e))

    }catch(e){
        console.log(e)
        return Promise.reject("Error while calling ws")
    }   
}

export const getWSGETURL = async (store,params = {}) => {

    user = store.getState()._template.user

    const commonParams = await getCommonParams(user);
    let wsQueryParams = {
        module_name : izi_api_app_code,
        module_version : izi_api_app_api_version
    }
    const baseUrl = getWSBaseUrl(user.server)

    const allParams = {...commonParams, ...wsQueryParams, ...params}

    let url = ''
    for(let prop in allParams){
        url += `${prop}=${allParams[prop]}&`
    }
    url = encodeURI(url.substr(0,url.length - 1))
    return baseUrl ? encodeURI(`${baseUrl}?${url}`) : null
}



//Sync functions

export async function loadTable(navigation, store, params, storeTable = null, extraTables=[]){
    
    const key = generateRandomKey(20)
        if(storeTable) store.dispatch({type:ACTIONS_TYPE.START_UPDATE, table:storeTable, id:key})
        try{
        //CheckConnectiviTy
        const state = await NetInfo.fetch()
        if(state.type == 'none' //remove this line when issue is fixed https://github.com/react-native-netinfo/react-native-netinfo/pull/510
            ||  state.isConnected){
                if(params == null){
                    params = {module_api:'get_'+storeTable}
                    /*if(storeTable === 'shipments'){
                            params.text = true
                            params._debug = true
                        }*/
                }
                try{
                    const response = await queryWS(navigation, store, params)
                    if(storeTable){
                       /* if(storeTable === 'locations'){
                            usr = store.getState()._template.user
                            let commonParams = await getCommonParams(usr)
                            console.log(response, params, commonParams)
                        }*/
                        if(response?.error){
                            throw Error(`Error on ws ${storeTable} : ${JSON.stringify(response)}`)
                        }
                        store.dispatch({
                            type:storeTable+ACTIONS_TYPE.TABLE_SET, 
                            value:response.data, 
                            time:response.time ? response.time : Date.now(),
                            i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                        })
                        extraTables.forEach(extraTbl => {
                            store.dispatch({
                                type:extraTbl+ACTIONS_TYPE.TABLE_SET, 
                                value:response[extraTbl], 
                                time:response.time ? response.time : Date.now(),
                                i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                            })
                        });
                    }
                    return response
                }catch(e){
                    usr = store.getState()._template.user
                    let commonParams = await getCommonParams(usr)
                    crashlytics().recordError(new Error('Error while getting table data: ' +storeTable + ', with params ' + JSON.stringify({...commonParams, ...params}) + ', with message : '+ e.message))
                    console.log(e)
                }            
        }else{
            console.log(state, "not connected")
            setTimeout(()=>{if(storeTable) store.dispatch({type:ACTIONS_TYPE.STOP_UPDATE, table:storeTable, id:key})}, 200)    
            return Promise.resolve(store.getState()["tablename"])
        }
        //checkToken

    }catch(e){
        console.log(e);
    }
    
    setTimeout(()=>{if(storeTable) store.dispatch({type:ACTIONS_TYPE.STOP_UPDATE, table:storeTable, id:key})}, 200)    
}

export async function saveTable(navigation, store, params, storeTable = null, extraTables=[], items = null){
    
    const key = generateRandomKey(20)
    items = items == null ? store.getState()[storeTable].local_data : items
    if(storeTable &&  items && items.length) store.dispatch({type:ACTIONS_TYPE.START_UPDATE, table:storeTable, id:key})
    else return 4
    //console.log("saving ", storeTable, items)
    try{
        //CheckConnectiviTy
        r = await NetInfo.fetch().then(  async state => {
            if(state.isConnected){
                    if(params == null){
                        params = {module_api:'save_'+storeTable}                        
                        params[storeTable] = items && JSON.stringify(items)
                        /*if(storeTable === 'shipments'){
                            params.text = true
                            params._debug = true
                        }*/
                    }

                    let ret = 0
                    return await queryWS(navigation, store, params)
                    .then(response => {
                        /*if(storeTable === 'shipments')
                            console.log(response)*/
                        if(storeTable){
                            store.dispatch({
                                type:storeTable+ACTIONS_TYPE.TABLE_SET, 
                                value:response.data, 
                                time:response.time ? response.time : Date.now(),
                                i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                            })
                            extraTables.forEach(extraTbl => {
                                store.dispatch({
                                    type:extraTbl+ACTIONS_TYPE.TABLE_SET, 
                                    value:response[extraTbl], 
                                    time:response.time ? response.time : Date.now(),
                                    i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                                })
                            });
                        }
                        return response
                    })
                    .catch(e=>{
                        crashlytics().recordError(new Error('Error while saving table data: ' +storeTable + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
                        console.log(e);
                        ret=3
                    })
                    return ret
            
            }else{
                console.log(state, "not connected")
                setTimeout(()=>{if(storeTable) store.dispatch({type:ACTIONS_TYPE.STOP_UPDATE, table:storeTable, id:key})}, 200)    
                return 1
            }
        });
        //checkToken

    }catch(e){
        console.log(e);
        crashlytics().recordError(new Error('Error before saving table data: ' +storeTable + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
        setTimeout(()=>{if(storeTable) store.dispatch({type:ACTIONS_TYPE.STOP_UPDATE, table:storeTable, id:key})}, 200)    
        return 2
    }
    
    setTimeout(()=>{if(storeTable) store.dispatch({type:ACTIONS_TYPE.STOP_UPDATE, table:storeTable, id:key})}, 200)
    if(r) return r;
}


//EXAMPLE
export async function getExampleAttachementTypesWithIdExternal(navigation, context, id_external){
    
    let json = null
    let params = {}

    try{
        params.id_external = id_external
        params.context = context
        params.module_api = 'get_attachments'
        
        let response = await queryWS(navigation, params)
        return response;
        //json = await response.json()
    }catch(e){
       return Promise.reject(e)
    }
}
