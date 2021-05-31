
export interface User{
        email : string,
        token? : Token,
        extra? : object
        server?:ServerType
        pin?:string
    }

export interface Token{
    email:string,
    token : string,
    refreshToken? : string,
    state:string,
    tokenType:TOKEN_TYPE,
    expirationDate?:string,
    refreshExpirationDate? : string,
}

export enum TOKEN_TYPE {
    IZIFLO="I",
    MICROSOFT="M",
    GOOGLE="G",
    DEMO="D"
}

export interface ServerType{
    url:string,
    name:string,
    id:Number,
    code:string
    instance? : InstanceType
}
export interface InstanceType{
    instance_code:string,
    instance_name:string,
    id_instance:Number,
    value?:Number,
    label?:string
}
export interface CompanyType{
    code:string,
    name:string,
    id:Number,
    value?:string,
    label?:string
}

export interface ErrorType{
    title:string,
    message:string,
    action_button?:{
        title:string,
        link:string,
    }
}

export enum ERROR_CODE{
    NO_INSTANCE='NO_INSTANCE',
    UNKNOWN_USER='UNKNOWN_USER',
}
