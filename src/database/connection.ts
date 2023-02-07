import { client } from './config'

export const startDataBse =async()=>{
    await client.connect()
    console.log("Connected database")
  }
    