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
export type DeveloperResult = QueryResult<IDeveloperBody>
export type DeveloperResultReacion = QueryResult<IDeveloperBodyRelacion>
export type RequeridDeveloper = 'name' |'email' 
export type RequeridDeveloperInfo = 'developerSince' |'preferredOS' 