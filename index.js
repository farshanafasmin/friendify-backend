require('dotenv').config()

const express=require('express')

const cors=require('cors')

const socialServer=express()

const router=require('./Routes/routes')

socialServer.use(cors())

socialServer.use(express.json())

socialServer.use(router)

require('./Connections/connection')

const PORT=8000 || process.env.port
socialServer.listen(PORT,()=>{
    console.log(`___________socialServer started at Port Number ${PORT}________`);
})