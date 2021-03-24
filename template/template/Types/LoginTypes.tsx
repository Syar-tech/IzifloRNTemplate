
export interface User{
        email : string,
        token : Token, 
        extra? : object
    }

export interface Token{
    token : string
    state:string,
    expirationDate:string
}
