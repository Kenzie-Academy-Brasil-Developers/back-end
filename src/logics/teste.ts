import { Request , Response } from 'express';


export const firstTeste = async (req:Request , res:Response): Promise<Response> =>{
    return res.status(200).json()
}