//String s tools

import { format, parse } from "date-fns";
import { Platform } from "react-native";
import { getUniqueId } from "react-native-device-info";
import { number_format } from "../Locales/number";
import base64 from 'react-native-base64';
import { __debug } from "./DevTools";

export const isEmpty = (str) => {
return (!str || 0 === str.length);
}

export const isEmailValid = (str) =>{
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(str).toLowerCase());
}

export function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.');
  
    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }
  
    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }
  
    if (zeroExtend) {
        while (v1parts.length < v2parts.length) v1parts.push("0");
        while (v2parts.length < v1parts.length) v2parts.push("0");
    }
  
    if (!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }
  
    for (var i = 0; i < v1parts.length; ++i) {
        if (v2parts.length == i) {
            return 1;
        }
  
        if (v1parts[i] == v2parts[i]) {
            continue;
        }
        else if (v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }
  
    if (v1parts.length != v2parts.length) {
        return -1;
    }
  
    return 0;
  }


  export function hexToRgbA(hex, alpha){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

  export function getDateFromDisplay(stringDate, settings) {
    if(!stringDate) return ''
    return parse(stringDate, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y'), new Date())
  }


  export function getTimeFromDisplay(stringTime, settings) {
    if(!stringTime) return ''
    return parse(stringTime, 'HH:mm', new Date())
  }


  export function getDateAndTimeFromDisplay(stringDateTime, settings) {
    if(!stringDateTime) return ''
    return parse(stringDateTime, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y') + ' HH:mm', new Date())
  }

  export function formatDateToYmdHs(date, UTC = true){
      const year = UTC ? date.getUTCFullYear() : date.getFullYear()
      const month = UTC ? (date.getUTCMonth()+1) : (date.getMonth()+1)
      const day = UTC ? date.getUTCDate() : date.getDate()
      const hour = UTC ? date.getUTCHours() : date.getHours()
      const minutes = UTC ? date.getUTCMinutes() : date.getMinutes()
      const seconds = UTC ? date.getUTCSeconds() : date.getSeconds()
    dt = "";
    dt += year
    dt += "-"
    dt += ("0" + month).slice(-2);
    dt += "-"
    dt += ("0" + day).slice(-2);
    dt += " "
    dt += ("0" + hour).slice(-2);
    dt += ":"
    dt += ("0" + minutes).slice(-2);
    dt += ":"
    dt += ("0" + seconds).slice(-2);
    return dt;
  }

  export function formatDateForDisplay(date, settings){
    if(!date || date == null || !date.getTime || !date.getTime()) return ''
    return  format(date, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y'))
  }

  export function formatDateAndTimeForDisplay(date, settings){
    if(!settings || !date || date == null || !date.getTime || !date.getTime()) return ''
    return  format(date, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y') + ' HH:mm')
  }

  export function formatTimeForDisplay(date, settings){
    if(!settings || !date || date == null || !date.getTime || !date.getTime()) return ''
    return  format(date, 'HH:mm')
  }

  export function alphabeticallyCompare(a, b) {

        // equal items sort equally
        if (a == b) {
            return 0;
        }
        // nulls sort after anything else
        else if (a === null) {
            return 1;
        }
        else if (b === null) {
            return -1;
        }
        return a < b ? -1 : 1;
    
      }

export function generateObjectUniqueId(key){
    return `${Platform.OS}_${getUniqueId()}_${key ? key : ""}_${Date.now()}`
}

export const NUMBER_FORMAT = {
    FOR_DISPLAY:0,
    FOR_INPUT:1,
    WITH_CURRENCY:2,
}


export function numberRoundedForCurrency(settings,currencies, number, currencyCode, formatMode = 0, forcedDecimals = null) {

    // Fetch currency info from stTables (optimized)
    let currencyData;
    let decimals;

    // if currency not null, get datas of this currency
    if (currencyCode != null) {
        currencyData = currencies?.find(curr => curr.code == currencyCode)
        /*if ( g_currencyData[currency] == undefined ) {
            let stSelectColumns = ["decimal_number", "label", "symbol"];
            let stTableName = "currency";
            let stConditions = {
                column : "code",
                operator : "LIKE",
                value : currency
            };
            currencyData = stContentProvider(stSelectColumns,stTableName, stConditions);
            g_currencyData[currency] = currencyData;
        } else {
            currencyData = g_currencyData[currency];
        }*/

    }
    // if forced decimal is null and currency data are init, use the decimal number of the currency
    if ( forcedDecimals == null && !!currencyData) {
        decimals = currencyData["decimal_number"];
    } else {
        decimals = forcedDecimals;
    }

    let returnValue;

    // format for input
    if ( formatMode == NUMBER_FORMAT.FOR_INPUT ) {
        returnValue = number_format(number, decimals, ".", "");
    } 
    // format for display
    else {
        returnValue = number_format(number, decimals, settings?.decimalSeparator || '.', settings?.thousandsSeparator || ',');
    }

    // Add currency code if necessary
    if ( formatMode == NUMBER_FORMAT.WITH_CURRENCY && !!currencyData ) {
        returnValue = returnValue + ((!isEmpty(currencyData['symbol'])) ? " " + currencyData['symbol'] : " " + currencyCode);
    }

    return returnValue;
}

export const capitalizeWords = (str) => {

    //split the above string into an array of strings 
    //whenever a blank space is encountered
    if(!str) return str
    const arr = str.split(" ");

    //loop through each element of the array and capitalize the first letter.


    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

    }

    //Join all the elements of the array back into a string 
    //using a blankspace as a separator 
    const str2 = arr.join(" ");
    return str2
}


export const getDateDiff = (dat, dat2 = 'now') => {
    if (dat2 == 'now'){
        dat2 = new Date()
        dat2.setHours(0)
        dat2.setMinutes(0)
        dat2.setSeconds(0)
        dat2.setMilliseconds(0)
    }
    
     return  (dat2.getTime() - dat.getTime()) / (1000 *3600 *24)

}

/*------------------------
*
*      settingds functions
*
------------------------*/


export const executeSettingsFunction = (settings,functionName, params) => {
    try{
        if(settings){
            if(Object.keys(settings?.functions)?.indexOf(functionName) >= 0){

                return executeFunctionString(treatFunctionB64(settings.functions[functionName]), params)
            }else {
                console.log('Error while executing function "'+functionName+'", function unknown ',Object.keys(settings?.functions)?.indexOf(functionName), functionName,treatFunctionB64(settings.functions[functionName]))
                return undefined
            }
        }else {
        console.log('Error while executing function "'+functionName+'", no settings')
        return undefined
        }
        
    }catch(e){
        console.log('Error while executing function "'+functionName+'" with params', params)
        console.log(e)
        return undefined;
    }
}
export const treatFunctionB64 = (func) => { 
    //remove obfuscation
    let str = func
    if(str.length>4){
        //remove start character
        str = str.substring(1)
        const equalPos = str.indexOf('=')
        //remove trailing character
        if(equalPos >0){
            str = str.substr(0, equalPos -1) + str.substr(equalPos)
        }else {
            str = str.substr(0, str.length -1)
        }
        //remove midle characters
            str = str.substr(0, 2) + str.substr(2+2)
    }
     str = base64.decode(str)
    // remove trailing nul
    str = str.replace(/[\u0000]/g,'');
    return str
}
 const executeFunctionString = (string, params)=> {

    try{
        let keys = []
        let values = []
        Object.entries(params).forEach(([key, value]) => {
            keys.push(key)
            values.push(value)
        });
        
        const f = new Function(...keys,string)
        return f(...values)
    }catch (e){
        console.log("error function", e)
        return false
    }
 }
