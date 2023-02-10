import { QueryResult } from "pg"

export interface IDeveloper{
    developerName:string,
    email:string
}
export interface IDeveloperBody extends IDeveloper{
    developId: number
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
    infoId:number
}

export type DeveloperResult = QueryResult<IDeveloperBody>
export type DeveloperResultReacion = QueryResult<IDeveloperBodyRelacion>
export type DeveloperInfoResult = QueryResult<IDeveloperInfoResult>
export type RequeridDeveloper = 'developerName' |'email' 
export type RequeridDeveloperInfo = 'developerSince' |'preferredOS' 