import { NextFunction, Request , Response } from 'express'
import { QueryConfig } from 'pg'
import {client} from '../database'
import { DeveloperResultReacion} from '../interfaces/interfaceDeveloper'

export const verifyIdDeveloper = async(req:Request , res:Response, next:NextFunction):Promise<Response|void>=>{
    let id :number = parseInt(req.params.id)
    if(!id){
        id= req.body.developerId
    }
    
    const queryString:string =`
    SELECT *
     FROM developers
     WHERE
     "id"=$1
    ; `

    const queryConfig :QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:DeveloperResultReacion = await client.query(queryConfig)
    if(queryResult.rows.length===0){

        return res.status(404).json({message:"Developer not found."})
    }

    return next()
}