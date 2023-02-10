import { Request, Response } from 'express'
import { QueryConfig } from 'pg'
import {client} from '../database'
import {DeveloperAndProjectsResult} from '../interfaces/interfaceDeveloper'

export const readProjectDeveloperById = async (req:Request , res:Response):Promise<Response>=>{

    const id:number = parseInt(req.params.id)

    const queryString:string= `
    SELECT 
        dv.*,
        dvi."developerSince",
        dvi."preferredOS",
        pj."id" AS "projectID",
        pj."name" AS "projectName",
        pj."description" AS "projectDescription",
        pj."estimatedTime" AS "projectEstimatedTime",
        pj."repository" AS "projectRepository",
        pj."startDate" AS "projectStartDate",
        pj."endDate" AS "projectEndDate",
        pjt."technologyId",
        tec."tecName" AS "technologyName"
    FROM developers AS dv
    LEFT JOIN developer_infos AS dvi
    ON dv."developerInfoId"= dvi."infoId"
       LEFT JOIN projects AS pj
    ON dv."developId"= pj."developerId"
       LEFT JOIN projects_technologies AS pjt
    ON  pj."id"= pjt."projectId"
    LEFT JOIN technologies AS tec
    ON  pjt."technologyId"= tec."id"

    WHERE 
    dv."developId"=$1
;
    ` 

    const queryConfig :QueryConfig={
        text:queryString,
        values:[id]
    }
    const queryResult:DeveloperAndProjectsResult = await client.query(queryConfig)
    return res.status(200).json(queryResult.rows)
}
const validadeTec =(obj:any):any=>{

    const keys=  Object.keys(obj)
    const validation:string[] = ['name']

    const verify = keys.every((element)=> validation.includes(element))

    if(!verify){
        throw new Error(`Mandatory key:[name]`); 
    }



    const newObject ={
        tec:obj.name
    }
    
    return newObject
}
export const addTecProjectById =async (req:Request , res:Response):Promise<Response>=>{

   try{
    const id:number = parseInt(req.params.id)
   
    const {tec} = validadeTec(req.body)

    const startDate = req.start
    
    const queryStringFilt:string=`
    SELECT * 
    FROM technologies 
    WHERE
    "tecName"=$1 
    `

    const queryConfigFilt :QueryConfig={
        text:queryStringFilt,
        values:[tec]
    }
    const queryResultFilt = await client.query(queryConfigFilt)
    const idTec = queryResultFilt.rows[0].id
    

    const queryString:string= `
    INSERT INTO "projects_technologies" ("addedIn","projectId" ,"technologyId")
    VALUES($1 ,$2, $3)   
    RETURNING *;
    `
    const queryConfig :QueryConfig={
        text:queryString,
        values:[startDate,id,idTec]
    }
    const queryResult = await client.query(queryConfig)

    return res.status(201).json(queryResult.rows[0])
   }
   catch(error:any){

    if(error.message.includes('Cannot read properties of undefined ')){
        return res.status(400).json({message:'Technology not supported', options:[
            "JavaScript",
            "Python",
            "React",
            "Express.js",
            "HTML",
            "CSS",
            "Django",
            "PostgreSQL",
            "MongoDB"
        ]})
    }
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }

    console.log(error)
    return res.status(500).json({message:error})
   }
}

export const deletTecnology = async (req:Request , res:Response):Promise<Response>=>{

    const id:number = parseInt(req.params.id)
    const name = req.params.name
    const queryStringTec:string= `
    SELECT *
     FROM technologies
     WHERE
     "tecName"=$1
;
    ` 
   const queryConfigTec :QueryConfig={
        text:queryStringTec,
        values:[name]
    }
    const queryResultTEc = await client.query(queryConfigTec) 

    if(queryResultTEc.rows.length===0){
        return res.status(404).json({message:'Technology not supported', options:[
            "JavaScript",
            "Python",
            "React",
            "Express.js",
            "HTML",
            "CSS",
            "Django",
            "PostgreSQL",
            "MongoDB"
        ]})
    }

    const idTec = queryResultTEc.rows[0].id

    const queryStringRelacion:string =`
        SELECT * 
        FROM projects_technologies
        WHERE
        "projectId"=$1
        AND
         "technologyId"=$2
        ;

    ` 
    const queryConfigRelacion:QueryConfig={
        text:queryStringRelacion,
        values:[id,idTec]
    }
    
    const queryResultRealacio= await client.query(queryConfigRelacion) 

    if(queryResultRealacio.rows.length===0){
        return res.status(404).json({message:`Technology ${name} not found on this Project.`})
    }

   const idRelacion =queryResultRealacio.rows[0].id
   

    const queryString:string=`

        DELETE FROM projects_technologies
        WHERE
        id=$1
    `
    const queryConfig:QueryConfig={
        text:queryString,values:[idRelacion]
    }

    await client.query(queryConfig)

    return res.status(204).json(queryResultRealacio.rows)
}