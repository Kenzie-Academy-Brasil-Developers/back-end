import { QueryResult } from "pg"

export interface IDeveloper{
    name:string,
    email:string
}
export interface IDeveloperBody extends IDeveloper{
    id: string
}
export type DeveloperResult = QueryResult<IDeveloperBody>

export type RequeridDeveloper = 'name' |'email' 