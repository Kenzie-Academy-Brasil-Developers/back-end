import  express, {json , Application} from 'express'
import { createDeveloper } from './logics/developer'
import {startDataBse} from './database'
const app: Application = express()
app.use(json())

app.post('/developers', createDeveloper)



const PORT:Number = 3000
const  runningMsg :string = `Server running on http://localhost:${PORT}`;


app.listen(PORT, async ()=>{

    await  startDataBse()
    console.log(runningMsg)
})