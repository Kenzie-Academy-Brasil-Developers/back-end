import { Request , Response } from 'express';
import format from 'pg-format';
import {DeveloperResult, IDeveloper, RequeridDeveloper} from '../interfaces/interfaceDeveloper'
import { client } from '../database';

export const validadeDeveloper = (obj:any):IDeveloper|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridDeveloper[] = ['name','email']
    const verifyResult = verify.every(element=>keys.includes(element))

    const limit = keys.length===2
    if(!verifyResult || !limit){
        const keyes =  verify.join(',')
        throw new Error(`Required keys are: ${keyes}`); 
    }

    return obj


}
export const createDeveloper = async (req:Request , res:Response): Promise<Response> =>{
   try{
    const validate=validadeDeveloper(req.body)
    const  keys:string[] =  Object.keys(validate)
    const  values:string[] =  Object.values(validate)

    

    const queryString:string = format(`
    INSERT INTO "developers" (%I)
    VALUES (%L)
    RETURNING *;
    `,keys,values)

    const queryResult:DeveloperResult= await client.query(queryString)

    return res.status(201).json(queryResult.rows[0])
   }catch(error:any){
    if(error.message.includes('duplicate key value violates unique constraint')){
        return res.status(409).json({message:"email already exists"})
    }

    if(error instanceof Error){
        console.log(error)
        return res.status(400).json({message:error.message})
    }
    
    return res.status(500).json({message:error})
   } 
}