
export interface User{
        email : string,
        token? : Token, 
        externalToken? : Token, 
        extra? : object
        server?:ServerType
        pin?:string
    }

export interface Token{
    email:string
    token : string
    state:string,
    expirationDate?:string
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
