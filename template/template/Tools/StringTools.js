//String s tools

import { format } from "date-fns";
import { Platform } from "react-native";
import { getUniqueId } from "react-native-device-info";

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
    if(!date || date == null || !date.getTime()) return ''
    return  format(date, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y'))
  }

  export function formatDateAndTimeForDisplay(date, settings){
    if(!date || date == null || !date.getTime()) return ''
    return  format(date, settings.dateFormat?.replaceAll('D','d')?.replaceAll('Y','y') + ' HH:mm')
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
