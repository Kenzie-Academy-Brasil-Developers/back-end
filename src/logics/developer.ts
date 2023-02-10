import { Request , Response } from 'express';
import format from 'pg-format';
import {DeveloperResult, IDeveloper, RequeridDeveloper,DeveloperResultReacion, RequeridDeveloperInfo, DeveloperInfoResult, IDeveloperBody, DeveloperAndProjectsResult} from '../interfaces/interfaceDeveloper'
import { client } from '../database';
import { QueryConfig } from 'pg';

export const validadeDeveloper = (obj:any):IDeveloper|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridDeveloper[] = ['developerName','email']
    const verifyResult = verify.every(element=>keys.includes(element))
    /* | */
    if(!verifyResult ){
        const keyes =  verify.join(',')
        throw new Error(`Missing required keys:${keyes}`); 
    }

    const newObjetc = {
        developerName: obj.developerName,
        email:obj.email
    }
    return newObjetc
}
export const validadeDeveloperInfo = (obj:any):IDeveloper|any=>{
    const keys:string[] = Object.keys(obj) 

    const verify:RequeridDeveloperInfo[] = ['developerSince','preferredOS']
    const verifyResult = verify.every(element=>keys.includes(element))

    if(!verifyResult){
        const keyes =  verify.join(',')
        throw new Error(`Missing required keys:${keyes}`); 
    }

    const newObjetct ={
        developerSince: obj.developerSince,
        preferredOS: obj.preferredOS
    }
    return newObjetct
}
export const validadeUpdateDeveloper = (obj:any):IDeveloper|any=>{

    if(obj.developerName===undefined && obj.email===undefined){
        throw new Error(`At least one of those keys must be send,key:developerName,email`);       
    }
    const keys:string[] = Object.keys(obj) 

    const verify = ['developerName','email']
    
    const verifyResult:boolean = keys.every(element=>verify.includes(element))


    if(!verifyResult ){
        const keyes =  verify.join(',')
        throw new Error(`it is only allowed to update one of these keys:${keyes}`); 
    }
    return obj 
}
export const validadeUpdateDeveloperInfo = (obj:any):IDeveloper|any=>{

    if(obj.developerSince===undefined && obj.preferredOS===undefined){
        throw new Error(`At least one of those keys must be send,key:developerSince,preferredOS`);       
    }
    const keys:string[] = Object.keys(obj) 

    const verify = ['developerSince','preferredOS']
    
    const verifyResult:boolean = keys.every(element=>verify.includes(element))


    if(!verifyResult ){
        const keyes =  verify.join(',')
        throw new Error(`it is only allowed to update one of these keys:${keyes}`); 
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
    SELECT
         dv.*,
         dvi."developerSince",
         dvi."preferredOS" 
    FROM developers AS dv 
    LEFT  JOIN developer_infos AS dvi 
    ON dv."developerInfoId" = dvi."infoId";`
    const queryResult:DeveloperResultReacion = await client.query(queryString)
    return res.status(200).json(queryResult.rows)

}
export const readDevelopersId = async(req:Request , res:Response):Promise<Response>=>{
    const id :number = parseInt(req.params.id) 

    const queryString:string =`
    SELECT
        dv.*,
        dvi."developerSince",
        dvi."preferredOS" 
    FROM developers AS dv 
    LEFT  OUTER JOIN developer_infos AS dvi 
    ON dv."developerInfoId" = dvi."infoId"
    WHERE
      dv."developId"=$1
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
    

    const queryString:string =format(`
    INSERT INTO developer_infos (%I)
     VALUES(%L)
        RETURNING *
    ;  
    `,keys,values)
    
    const queryResult:DeveloperInfoResult = await client.query(queryString)


   const queryStringUpdate:string =`
    UPDATE developers
      SET("developerInfoId") = ROW($1)
      WHERE 
       "developId"=$2
       RETURNING *; 
    `
    const queryConfigUpdate:QueryConfig={
        text:queryStringUpdate,
        values:[queryResult.rows[0].infoId,id]
    }

    await client.query(queryConfigUpdate)

   

    return res.status(201).json(queryResult.rows[0])
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

export const updateDeveloper = async(req:Request , res:Response):Promise<Response>=>{
    try{
        validadeUpdateDeveloper(req.body)
    const id:number = parseInt(req.params.id)
    const keys :string[]= Object.keys(req.body) 
    const value :string[]= Object.values(req.body) 

    const queryString :string = format(`
    
    UPDATE developers
    SET(%I) = ROW(%L)
    WHERE 
     "developId"=$1
     RETURNING *
     ;
    `,keys,value)

    const queryConfig:QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:DeveloperResult= await client.query(queryConfig)
    return res.status(200).json(queryResult.rows[0])
    }
    catch(error:any){
        if(error.message.includes('duplicate key value violates unique constraint "developers_email_key')){
            return res.status(409).json({message:"email already exists"})
        }
        if(error instanceof Error){
            return res.status(400).json({message:error.message})
        }
        console.log(error)
        return res.status(500).json({message:error})
    }
}

export const updateInfoDeveloperId = async (req:Request , res:Response):Promise<Response>=>{
   try{
    validadeUpdateDeveloperInfo(req.body)
    const id:number = parseInt(req.params.id)
    const keys = Object.keys(req.body)
    const values = Object.values(req.body)

    let queryString:string = `
    SELECT *
    FROM developers
    WHERE 
    "developId"=$1;
`
    const queryConfig:QueryConfig={
        text:queryString,values:[id]
    }
    const queryResult:DeveloperResultReacion=  await client.query(queryConfig)

    const idInfo = queryResult.rows[0].developerInfoId
    

     queryString = format(`
        UPDATE developer_infos
        SET(%I)=ROW(%L)
        WHERE 
        "infoId"=$1
        RETURNING *
    `,keys,values)

    const queryConfigInfo :QueryConfig={
        text:queryString,
        values:[idInfo]
    }

    const queryResultInfo :DeveloperInfoResult=  await client.query(queryConfigInfo)
   



    return res.status(200).json(queryResultInfo.rows[0])
   }
   catch(error:any){
    if(error.message.includes('invalid input value for enum \"OS\":')){
        return res.status(409).json({message:"preferredOS permission :Windows,Linux,MacOS"})
    }
    if(error instanceof Error){
        return res.status(400).json({message:error.message})
    }
    console.log(error)
    return res.status(500).json({message:error})
   }
}

export const deletDeveloper = async (req:Request , res:Response):Promise<Response>=>{
    const id:number = parseInt(req.params.id)

    let queryString:string = `
    SELECT *
    FROM developers
    WHERE 
    "developId"=$1;
`
    const queryConfig:QueryConfig={
        text:queryString,values:[id]
    }
    const queryResult=  await client.query(queryConfig)
    const idInfo = queryResult.rows[0].developerInfoId
    
    const queryStringDelet:string=`
    DELETE FROM developer_infos
    WHERE
    "infoId"=$1  
    `

    const queryConfigDelet:QueryConfig={
        text:queryStringDelet,
        values:[idInfo]
    }
     await client.query(queryConfigDelet)

    return res.status(204).json()
}
