import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import connectDb from './config/dbConfig.js'
import authRoutes from './routes/AuthRoute.js'

dotenv.config();

const app = express();
const port = process.env.PORT || 5000

//MILLEWARES
app.use(cors({
    origin: [process.env.ALLOWED_ORIGIN],
    methods:["GET","PUT","POST","DELETE","PATCH"],
    credentials:true
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth',authRoutes)


app.listen(port,()=>{
    console.log(`Server is listening on port: ${port}`)
})

connectDb()