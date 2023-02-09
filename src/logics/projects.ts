import {Request , Response} from 'express'
import format from 'pg-format'
import { client } from '../database'
import {IprojectBody, ProjectResult, RequeridProjectKeys} from '../interfaces/interfaceProjects'
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

    return res.status(200).json(queryResult.rows[0])

  }
  catch(error){
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }
    console.log(error)
    return  res.status(500).json({message:error})
  }
}