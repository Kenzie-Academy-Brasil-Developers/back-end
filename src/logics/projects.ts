import {Request , Response} from 'express'
import { QueryConfig } from 'pg'
import format from 'pg-format'
import { client } from '../database'
import {IprojectBody, ProjectListResult, ProjectResult, RequeridProjectKeys} from '../interfaces/interfaceProjects'
const validadeKeysProject = (obj:any):IprojectBody|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridProjectKeys[] = ['name','description','estimatedTime','repository','startDate','developerId']

    const verifyResult = verify.every(element=>keys.includes(element))

    const limit = keys.length===6
    if(!verifyResult || !limit){
        const keyes =  verify.join(',')
        throw new Error(`Missing required keys:${keyes}`); 
    }
    return obj
}
const validadeKeysUpdateProject = (obj:any):IprojectBody|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:string[] = ['name','description','estimatedTime','repository','startDate','developerId','endDate']

    const verifyResult = keys.every((element)=>verify.includes(element))

    if(!verifyResult){
        const keyes =  verify.join(',')
        throw new Error(`keys allowed for update:${keyes}`); 
    }
    return obj
}
export const creatProject = async (req:Request , res:Response):Promise<Response>=>{

  try{
    validadeKeysProject(req.body)
    const keys:string[] = Object.keys(req.body)
    const values:string[] = Object.values(req.body)


    const queryString :string= format(`
    INSERT INTO "projects" (%I)
    VALUES(%L)   
    RETURNING *;    
    `,keys,values)

    const queryResult:ProjectResult = await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])

  }
  catch(error){
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }
    console.log(error)
    return  res.status(500).json({message:error})
  }
}
export const readProjects =  async(req:Request , res:Response):Promise<Response>=>{

    const queryString:string = `
    SELECT pj.*,
        pjt."technologyId",
        tec."tecName"
    FROM projects AS pj 
    LEFT  JOIN projects_technologies AS pjt 
    ON pj."id" = pjt."projectId"
    LEFT JOIN technologies AS tec
    ON pjt."technologyId" = tec."id";
    `

    const queryResult:ProjectListResult =  await client.query(queryString)


    return res.status(200).json(queryResult.rows)
}
export const readProjectsById =  async(req:Request , res:Response):Promise<Response>=>{

    const id:number = parseInt(req.params.id) 

    const queryString:string = `
    SELECT pj.*,
        pjt."technologyId",
        tec."tecName"
    FROM projects AS pj 
    LEFT OUTER JOIN projects_technologies AS pjt 
    ON pj."id" = pjt."projectId"
    LEFT JOIN technologies AS tec
    ON pjt."technologyId" = tec."id"
    WHERE 
     pj.id=$1
    ;
    `
    const querConfig:QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:ProjectListResult=  await client.query(querConfig)


    return res.status(200).json(queryResult.rows)
}
export const updateProject =  async(req:Request , res:Response):Promise<Response>=>{

  try{
    const id:number = parseInt(req.params.id) 
    validadeKeysUpdateProject(req.body)

    const keys =  Object.keys(req.body)
    const values = Object.values(req.body)
    const queryString: string = format(`
    UPDATE projects
    SET(%I)=ROW(%L)
    WHERE 
    id=$1
    RETURNING*;
    
    `,keys,values)

    const queryConfig:QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:ProjectResult = await client.query(queryConfig)
    return res.status(200).json(queryResult.rows[0])
  }
  catch(error:any){
    if(error.message.includes('insert or update on table \"projects\" violates foreign key constraint \"projects_developerId_fkey')){
        return res.status(409).json({message:'developerId inválido'})
    }
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }
    console.log(error)
    return res.status(500).json({message:error})
  }
}    

export const deletProject = async (req:Request , res:Response): Promise<Response>=>{

    const id:number = parseInt(req.params.id)

    const queryString:string= `
        DELETE FROM projects
        WHERE
            id=$1
        `
    const queryConfig:QueryConfig={
        text:queryString,
        values:[id]
    }
    await client.query(queryConfig)

    return res.status(204).json()
}