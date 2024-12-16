import { createSelector } from "@reduxjs/toolkit"

export const privilegesSelector = createSelector(
    [
        state => state._template.user?.settings?.privileges,
        (state, privilegesNames) => privilegesNames
    ], 
    (privileges, privList) => {
        if(privileges){
            const p = {}

            if(Array.isArray(privileges))
                privileges.forEach(privilege => {
                    for(let prop in privilege)
                        if(privilege.hasOwnProperty(prop))
                            p[prop] = privilege[prop]
                })
                const array = []
                for(let prop in p){
                    if(p[prop] && (!privList || privList.indexOf(prop) >= 0))
                        array.push(prop)
                }
            return array
        }else return []
})
