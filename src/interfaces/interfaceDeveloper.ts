import { QueryResult } from "pg"

export interface IDeveloper{
    name:string,
    email:string
}
export interface IDeveloperBody extends IDeveloper{
    id: string
    developerInfoId:null|number
}
export interface IDeveloperBodyRelacion extends IDeveloperBody{
    developerSince:String
    preferredOS:string

}
export interface IDeveloperInfo{
    developerSince:String
    preferredOS:string
}
export interface IDeveloperInfoResult extends IDeveloperInfo{
    id:number
}

export type DeveloperResult = QueryResult<IDeveloperBody>
export type DeveloperResultReacion = QueryResult<IDeveloperBodyRelacion>
export type DeveloperInfoResult = QueryResult<IDeveloperInfoResult>
export type RequeridDeveloper = 'name' |'email' 
export type RequeridDeveloperInfo = 'developerSince' |'preferredOS' 