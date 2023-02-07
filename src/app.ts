import  express, {json , Application} from 'express'
import { firstTeste } from './logics/teste'
import {startDataBse} from './database'
const app: Application = express()
app.use(json())

app.get('/', firstTeste)

const PORT:Number = 3000
const  runningMsg :string = `Server running on http://localhost:${PORT}`;


app.listen(PORT, async ()=>{

    await  startDataBse()
    console.log(runningMsg)
})