import { Request , Response } from 'express';
import format from 'pg-format';
import {DeveloperResult, IDeveloper, RequeridDeveloper,DeveloperResultReacion, RequeridDeveloperInfo} from '../interfaces/interfaceDeveloper'
import { client } from '../database';
import { QueryConfig } from 'pg';

export const validadeDeveloper = (obj:any):IDeveloper|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridDeveloper[] = ['name','email']
    const verifyResult = verify.every(element=>keys.includes(element))

    const limit = keys.length===2
    if(!verifyResult || !limit){
        const keyes =  verify.join(',')
        throw new Error(`Missing required keys:${keyes}`); 
    }
    return obj
}
export const validadeDeveloperInfo = (obj:any):IDeveloper|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridDeveloperInfo[] = ['developerSince','preferredOS']
    const verifyResult = verify.every(element=>keys.includes(element))

    const limit = keys.length===2
    if(!verifyResult || !limit){
        const keyes =  verify.join(',')
        throw new Error(`Missing required keys:${keyes}`); 
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

export const readDevelopers = async(req:Request , res:Response):Promise<Response>=>{


    const queryString:string =`
    SELECT dv.*,
        dvi."developerSince",
        dvi."preferredOS" 
    FROM developers dv 
    JOIN developer_infos dvi 
    ON dv."developerInfoId" = dvi.id;  
    `

    const queryStringFail:string =`
    SELECT *
    FROM developers;  
    `

    const queryResult:DeveloperResultReacion = await client.query(queryString)

    if(queryResult.rows.length===0){
        const queryResultFail = await client.query(queryStringFail)
       
        return res.status(200).json(queryResultFail.rows)
    }


    return res.status(200).json(queryResult.rows)

}
export const readDevelopersId = async(req:Request , res:Response):Promise<Response>=>{
    const id :number = parseInt(req.params.id) 

  /*   const queryString:string =`
    SELECT dv.*,
        dvi."developerSince",
        dvi."preferredOS" 
    FROM developers dv 
    JOIN developer_infos dvi 
    ON dv."developerInfoId" = dvi.id;  
    ` */
    const queryString:string =`
    SELECT *
     FROM developers
     WHERE
        id=$1
    ;  
    `
    const queryConfig :QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:DeveloperResultReacion = await client.query(queryConfig)

    return res.status(200).json(queryResult.rows[0])

}
export const createInfoDeveloper = async(req:Request , res:Response):Promise<Response>=>{
    
    
  try{
    const verifyResult=validadeDeveloperInfo(req.body)
    const id :number = parseInt(req.params.id)
    const keys:string[] = Object.keys(verifyResult)
    const values: string[]=  Object.values(verifyResult)
    
    console.log(id)
    const queryString:string =format(`
    INSERT INTO developer_infos (%I)
     VALUES(%L)
        RETURNING *
    ;  
    `,keys,values)
   /*  const queryConfig :QueryConfig={
        text:queryString,
        values:[id]
    } */

    const queryResult:DeveloperResultReacion = await client.query(queryString)

    return res.status(200).json(queryResult.rows[0])
  }
  catch(error:any){
    if(error.message.includes('invalid input value for enum \"OS\"')){
        return res.status(409).json({message:'preferredOS permission :Windows,Linux,MacOS'})
    }
    if(error instanceof Error){
        console.log(error)
        return res.status(400).json({message:error.message})
    }
    
    return res.status(500).json({message:error})
   } 

  

}