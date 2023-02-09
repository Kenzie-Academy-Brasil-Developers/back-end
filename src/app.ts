import  express, {json , Application} from 'express'
import { createDeveloper, createInfoDeveloper, deletDeveloper, readDevelopers, readDevelopersId, updateDeveloper, updateInfoDeveloperId } from './logics/developer'
import {creatProject, readProjects, readProjectsById, updateProject} from './logics/projects'
import {startDataBse} from './database'
import {verifyIdDeveloper} from './middlewares/middlewares.developer'
import{verifyIdProject} from  './middlewares/middlewares.projects'
const app: Application = express()
app.use(json())

app.post('/developers', createDeveloper)
app.get('/developers', readDevelopers )
app.get('/developers/:id',verifyIdDeveloper,  readDevelopersId )
app.post('/developers/:id/infos',verifyIdDeveloper,  createInfoDeveloper )
app.patch('/developers/:id',verifyIdDeveloper,  updateDeveloper )
app.patch('/developers/:id/infos',verifyIdDeveloper,  updateInfoDeveloperId )
app.delete('/developers/:id',verifyIdDeveloper,  deletDeveloper )

app.post ('/projects' ,verifyIdDeveloper, creatProject)
app.get('/projects',readProjects )
app.get('/projects/:id',verifyIdProject, readProjectsById )
app.patch('/projects/:id',verifyIdProject,updateProject)





const PORT:Number = 3000
const  runningMsg :string = `Server running on http://localhost:${PORT}`;


app.listen(PORT, async ()=>{

    await  startDataBse()
    console.log(runningMsg)
})