

export const __log = (...args) => {
    for (let index = 0; index < args.length; index++){
        if(typeof(args[index]) =='object' || Array.isArray(args[index])) args[index] = JSON.stringify(args[index], null, 2)
    }
    console.log(...args)
}

export const __debug = (...args) => {
    if(__DEV__) __log(...args)
}