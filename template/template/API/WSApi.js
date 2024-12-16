
import {izi_api_app_code,izi_api_app_api_version} from "../../config/iziConfig"
import {generateRandomKey, getCommonParams} from "../Tools/TokenTools"
import NetInfo from "@react-native-community/netinfo";
import crashlytics from '@react-native-firebase/crashlytics'
import { checkToken} from "./LoginApi";
import { batch } from "react-redux";
import { ACTIONS_TYPE } from "../../Store/ReduxStore";
import { NativeModules, Platform } from 'react-native'

//Api Object for post|get promises
//Api::post(url,data) || Api::get(url,data)

 export const Api = function(method, url, data, headers = {}){
    let isMultipart = method == 'post' && data['__files']
    if(isMultipart){
        console.log("isMultipart", data)
        headers = {'Content-Type': 'multipart/form-data',...(headers ? {} : headers)}
    }
        let body = '?'
    if(isMultipart){
        body = new FormData()
        for(const prop in data)
            if(data.hasOwnProperty(prop)){
                if(prop == '__files' && Array.isArray(data['__files'])){
                    data['__files'].forEach((file, index) => {
                        body.append(file.key || 'attachment_'+(index+1), {
                            uri:file.uri,
                            name: file.name,
                            type:file.type
                        })
                    });

                }else
                    body.append(prop,typeof(data[prop]) == 'string' || typeof(data[prop]) == 'number' ? data[prop] : JSON.stringify(data[prop]))
            }
    }else{
        for(const prop in data)
            if(data.hasOwnProperty(prop)){
                if(body.length == 0)
                    body +='?'
                else body += '&'
                body+=`${prop}=${encodeURIComponent(data[prop])}`
            }
    }
    const request = {
        method: method.toUpperCase(),
        credentials: Api.credentials,
        headers: Object.assign({}, Api.headers, headers)
    };
    if(method.toLowerCase() === 'get'){
        if(body.length>1)
            url+=body
    }
    else
        request.body = body
    
    return fetch(url, request).then(res => res.ok ? res : Promise.reject(res))
};
(function(){
    localeStr= 'en'
    if(Platform.OS === 'ios'){
        // iOS:
        localeStr = NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // "fr_FR"
    }else if (Platform.OS === 'android'){
        // Android:
        localeStr = NativeModules.I18nManager.localeIdentifier // "fr_FR"
    }
    console.log("ws locale", localeStr)
    Api.credentials = 'same-origin';
    Api.headers = {
        'Accept': 'application/json;application/pdf',
        'Content-Type':'application/x-www-form-urlencoded',
        'Accept-Language':localeStr
    };
    ['get', 'post', 'multipart'].forEach(method => {
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
                };
                return Api.post(getWSBaseUrl(usr.server),{...commonParams, ...wsQueryParams, ...params})
                    .then(async (response) =>{return params?.text ? response.text() : response.json()}).catch(e => console.log('ERROR FETCHING DATA',e.message, e))
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



/*--------------------
 *
 *    Load and save table
 * 
 -------------------*/

const loadTableCooldown = 300000 // 5 minutes
const canBeUpdated = (store,tables,forceUpdate = false) => 
(
forceUpdate 
    || ((typeof tables) == "string" &&  Date.now() - store.getState()[tables].lastTableSet > loadTableCooldown)
    || (Array.isArray(tables) && tables.some(table => Date.now() - store.getState()[table].lastTableSet > loadTableCooldown))
)

export async function loadTableWithCheckSync(navigation, store, params, storeTable = null, extraTables=[], forceUpdate = false){
    if(canBeUpdated(store,[storeTable, ...extraTables],forceUpdate))
        return await loadTable(navigation,store,params,storeTable, extraTables)
}

 export async function loadTable(navigation, store, params, storeTable = null, extraTables=[]){
    let start = Date.now()
    console.log("load table Start : ", storeTable, start)
    const key = generateRandomKey(20)
        try{
        //CheckConnectiviTy
        const state = await NetInfo.fetch()
        if(state.type == 'none' //remove this line when issue is fixed https://github.com/react-native-netinfo/react-native-netinfo/pull/510
            ||  state.isConnected){
                if(params == null){
                    params = {module_api:'get_'+storeTable}
                    /*if(storeTable === 'inventories'){
                        params.text = true
                        params._debug = true
                    }//*/
                }
                try{
                    let response = await queryWS(navigation, store, params)
                    if(storeTable){

                        if(params.text == true)
                            console.log("xx",response)

                        if(response?.error){
                            throw Error(`Error on ws ${storeTable} : ${JSON.stringify(response)}`)
                        }
                        batch(()=>{
                            store.dispatch({
                                type:storeTable+ACTIONS_TYPE.TABLE_SET, 
                                value:response.data, 
                                time:response.time ? response.time : Date.now(),
                                i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                            })
                            extraTables.forEach(extraTbl => {
                                if(response[extraTbl]){
                                    //console.log("dispatch : ",extraTbl, Date.now(), (Date.now()-start)/1000.0)
                                    store.dispatch({
                                        type:extraTbl+ACTIONS_TYPE.TABLE_SET, 
                                        value:response[extraTbl], 
                                        time:response.time ? response.time : Date.now(),
                                        i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                                    })
                                }
                            });
                        })
                    }
                    const end = Date.now()
                    return response
                }catch(e){
                    usr = store.getState()._template.user
                    let commonParams = await getCommonParams(usr)
                    crashlytics().recordError(new Error('Error while getting table data: ' +storeTable + ', with params ' + JSON.stringify({...commonParams, ...params}) + ', with message : '+ e.message))
                    console.log(e)
                }
        }else{
            console.log(state, "not connected")
            return false
        }
        //checkToken

    }catch(e){
        console.log(e);
    }

    return false
     
}

export async function saveTable(navigation, store, params, storeTable = null, extraTables=[], items = null){
    
    const key = generateRandomKey(20)
    items = items == null ? store.getState()[storeTable].local_data : items
    if(!storeTable ||  !items || !items.length) return 4
    //console.log("saving ", storeTable, items)
    try{
        //CheckConnectiviTy
        r = await NetInfo.fetch().then(  async state => {
            if(state.isConnected){
                let initParams = {module_api:'save_'+storeTable}                        
                initParams[storeTable] = items && JSON.stringify(items)
                    if(params == null){
                        params = initParams
                    }else{
                        params = {...initParams, ...params}
                    }

                    /*if(storeTable === 'shipments' ){
                        params.text = true
                        params._debug = __DEV__ ? 1 : 0
                    }//*/

                    let ret = 0

                    console.log("call API "+api+ " started", Date.now())
                    //console.log("params", params)
                    return await queryWS(navigation, store, params, true)
                    .then(response => {
                        if(params.text === true)
                            console.log("RES", response)
                        else if(response.error) {
                            console.log('RESPONSE : ',response.error)
                        }

                        if(storeTable){
                            batch(()=>{
                                if(response?.data){
                                    store.dispatch({
                                        type:storeTable+ACTIONS_TYPE.TABLE_SET, 
                                        value:response.data, 
                                        time:response.time ? response.time : Date.now(),
                                        i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                                    })
                                }
                                else 
                                    console.log('API Save : Main table is empty <'+storeTable+'>')
                                
                                extraTables.forEach(extraTbl => {
                                    if( response && response[extraTbl])
                                        store.dispatch({
                                            type:extraTbl+ACTIONS_TYPE.TABLE_SET, 
                                            value:response[extraTbl], 
                                            time:response.time ? response.time : Date.now(),
                                            i_id:store?.getState()?._template?.user?.server?.instance?.id_instance
                                        })
                                });
                            })
                        }
                        return response
                    })
                    .catch(e=>{
                        console.log("save table end (crash)", Date.now())
                        crashlytics().recordError(new Error('Error while saving table data: ' +storeTable + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
                        console.log(e);
                        ret=3
                        return ret
                    })
            }else{
                console.log(state, "not connected")   
                return 1
            }
        });
        //checkToken

    }catch(e){
        console.log(e);
        crashlytics().recordError(new Error('Error before saving table data: ' +storeTable + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
        return 2
    }
    
    if(r) return r;
}


export async function callApi(navigation, store, params, api = null){
    const key = generateRandomKey(20)
    if(!api ||  !params) return 4
    try{
        //CheckConnectiviTy
        r = await NetInfo.fetch().then(  async state => {
            if(state.isConnected){
                let initParams = {module_api:api}
                    if(params == null){
                        params = initParams
                    }else{
                        params = {...initParams, ...params}
                    }

                    if(api === 'zz_ave_work_order'){
                        params.text = true
                        params._debug = __DEV__ ? 1 : 0
                    }//

                    let ret = 0

                    console.log("querying api start "+api, Date.now())
                    //console.log("params", params)
                    return await queryWS(navigation, store, params)
                    .then(response => {
                        if(params.text === true)
                            console.log("RES", response)
                        else if(response.error) {
                            console.log('RESPONSE : ',response.error)
                        }
                        return response
                    })
                    .catch(e=>{
                        console.log("querying api end (crash) "+api, Date.now())
                        crashlytics().recordError(new Error('Error while querying api: ' +api + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
                        console.log(e);
                        ret=3
                        return ret
                    })
            }else{
                console.log(state, "not connected")   
                return 1
            }
        });
        //checkToken

    }catch(e){
        console.log(e);
        crashlytics().recordError(new Error('Error before querying api: ' +api + ', with params ' + JSON.stringify(params) + ', with message : '+ e.message))
        return 2
    }
    
    if(r) return r;
}



/*--------------------
 *
 *    Example
 * 
 -------------------*/

export async function getExampleAttachementTypesWithIdExternal(navigation, store, context, id_external){
    
    let json = null
    let params = {}

    try{
        params.id_external = id_external
        params.context = context
        params.module_api = 'get_attachments'
        
        let response = await queryWS(navigation,store ,params)
        return response;
        //json = await response.json()
    }catch(e){
       return Promise.reject(e)
    }
}


export async function loadCustomTable(navigation, store,forceUpdate = false){
    
    return await loadTableWithCheckSync(navigation, store, null,  "custom",['stock','companies', "deliveries"], forceUpdate)
}
