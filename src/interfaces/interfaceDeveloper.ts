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

export interface IdeveloperAndProject {
        developerID: number,
        developerName: string,
        developerEmail: string,
        developerInfoID: number,
        developerInfoDeveloperSince: Date|null,
        developerInfoPreferredOS: string|null,
        projectID: number|null,
        projectName: string|null,
        projectDescription: string|null,
        projectEstimatedTime: string|null,
        projectRepository: string|null,
        projectStartDate: Date|null,
        projectEndDate: string |null,
        technologyId: number |null,
        technologyName: string| null
}

export type DeveloperResult = QueryResult<IDeveloperBody>
export type DeveloperResultReacion = QueryResult<IDeveloperBodyRelacion>
export type DeveloperInfoResult = QueryResult<IDeveloperInfoResult>
export type DeveloperAndProjectsResult = QueryResult<IdeveloperAndProject>
export type RequeridDeveloper = 'developerName' |'email' 
export type RequeridDeveloperInfo = 'developerSince' |'preferredOS' 