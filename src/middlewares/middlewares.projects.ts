import { NextFunction, Request , Response } from 'express'
import { QueryConfig } from 'pg'
import { client } from '../database'
import { ProjectResult } from '../interfaces/interfaceProjects'


export const verifyIdProject = async(req:Request , res:Response, next:NextFunction):Promise<Response|void>=>{
    let id :number = parseInt(req.params.id)
    if(!id){
        id= req.body.developerId
    }
    
    const queryString:string =`
    SELECT *
     FROM projects
     WHERE
        id=$1
    ; `

    const queryConfig :QueryConfig={
        text:queryString,
        values:[id]
    }

    const queryResult:ProjectResult = await client.query(queryConfig)
    if(queryResult.rows.length===0){

        return res.status(404).json({message:"Project not found."})
    }
    req.start = queryResult.rows[0].startDate

    return next()
}