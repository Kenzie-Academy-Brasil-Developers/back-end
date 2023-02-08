import  express, {json , Application} from 'express'
import { createDeveloper, createInfoDeveloper, readDevelopers, readDevelopersId, updateDeveloper } from './logics/developer'
import {startDataBse} from './database'
import {verifyIdDeveloper} from './middlewares/middlewares.developer'
const app: Application = express()
app.use(json())

app.post('/developers', createDeveloper)
app.get('/developers', readDevelopers )
app.get('/developers/:id',verifyIdDeveloper,  readDevelopersId )
app.post('/developers/:id/infos',verifyIdDeveloper,  createInfoDeveloper )
app.patch('/developers/:id',verifyIdDeveloper,  updateDeveloper )



const PORT:Number = 3000
const  runningMsg :string = `Server running on http://localhost:${PORT}`;


app.listen(PORT, async ()=>{

    await  startDataBse()
    console.log(runningMsg)
})