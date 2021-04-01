
import {izi_api_client_id, izi_api_app_code} from "../../config/iziConfig"
import Config from "react-native-config";
import {getStoredUser} from "../Tools/TokenTools"
import {getUniqueId} from 'react-native-device-info'
import { checkToken, requestToken } from "./LoginApi";

//Api Object for post|get promises
//Api::post(url,data) || Api::get(url,data)

const Api = function(method, url, data, headers = {}){
    let body = ''
    for(const prop in data)
        if(data.hasOwnProperty(prop))
            body+=`&${prop}=${encodeURIComponent(data[prop])}`
    
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

  export const queryWS = (context, ws_name, params ) => {

    const user = await getStoredUser()

    let commonParams = {
            token,
            client_id : izi_api_app_code,
            module_name : 'core',
            module_version:Config.CORE_VERSION,
            device_id:getUniqueId()
        }

        wsQueryParams = {
            module_name : izi_api_app_code,
            module_version : izi_api_app_api_version,
            id_instance:user.server.instance.id_instance
        }

        try{
        checkToken().then((data)=>{
            if(data.error){
                
            }
        })

            const response = await Api.post(`${user.server.url}/mobile_ws/index.php?m=${ws_name}`,commonParams)
            json = await response.json()
        }catch(e){
            return false
        }   
  }

  
  
  const instance = 2
  const token = '7126f2be124706195f0fee8aa10b2062e57805c9ef82635e439b9d77fd07aa4bfd660f027912077408158d6db90ea188aef14bbb5f166cbf053572afc9658e0d'
  const client_id = 'a1922dbbd5dbe51d3b96cf13c7f1fa2a'
  const module_name = 'zscan'
  const module_version = '0.0.1.0'
  const device_id = 'ios_1234'
  const server_url = `http://192.168.13.205:1082/iziflo_1.5.21m_cfao/mobile_ws/core/${module_version}/index.php`
  //const email = 'elebon@syartec.com'
  //const pass = 'elebon'
  
  export async function getAttachementTypesWithIdExternal(id_external, context){
  
    let json = null
    let commonParams = await getApiParams();

    try{
        commonParams.externalId = id_external
        commonParams.context = context
        commonParams.module_api = 'get_attachments'

        const response = await Api.post(`${server_url}?m=attachment`,commonParams)
        json = await response.json()
    }catch(e){
        return false
    }    
  
    if(json){
        if(json.error || (json.token && json.token.state === 'INVALID')){
            //Error
            if(json.token.state === 'INVALID'){
                //Token error
            }else if(json.error){
                //Error from the server
            }
        }
    }
  
    return json
    return {"display_data":" hippo Box ","data":[{"id":"40","name":"Bon de commande","code":"Bon de commande","is_mandatory":false,"cpt":0,"items":[]},{"id":"152","name":"Accord Financier \/ Justificatif de paiement","code":"Accord Financier \/ Justificatif de paiement","is_mandatory":false,"cpt":0,"items":[]},{"id":"208","name":"Bon de livraison","code":"Bon de livraison","is_mandatory":false,"cpt":0,"items":[]},{"id":"264","name":"Attestation d'assurance","code":"Attestation d'assurance","is_mandatory":false,"cpt":0,"items":[]},{"id":"376","name":"Documents d'immatriculation","code":"Documents d'immatriculation","is_mandatory":false,"cpt":0,"items":[]},{"id":"924","name":"Accord Financier \/ Justificatif de paiement","code":"Accord Financier \/ Justificatif de paiement","is_mandatory":false,"cpt":0,"items":[]},{"id":"943","name":"Autre","code":"Autre","is_mandatory":false,"cpt":0,"items":[]}]};
}

export const queryWS = (module, version, wsName) => {

}