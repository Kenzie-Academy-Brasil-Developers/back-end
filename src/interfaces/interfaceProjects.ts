import { QueryResult } from "pg"
export interface IprojectBody{
    id:number
    name:string
    description:string
    estimatedTime:string
    repository:string
    startDate:Date
    endDate:Date|null
}

export interface Iprojetc extends IprojectBody{
    developerId:number
}

export type ProjectResult = QueryResult<Iprojetc>
export type RequeridProjectKeys = 'name' |'description' |'estimatedTime' |'repository' |'startDate'|'developerId'