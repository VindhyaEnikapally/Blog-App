import exp from 'express'
import { connect } from 'mongoose'
import { config } from 'dotenv'
import { userRoute } from './APIs/UserAPI.js'
import { authorRoute } from './APIs/AuthorAPI.js'
import { adminRoute } from './APIs/AdminAPI.js'
import { commonRouter } from './APIs/CommonAPI.js'
import cookieParser from 'cookie-parser'
config() //process.env

//create express application


const app=exp()

//add body parser middleware if not used req of body is always undefined
app.use(exp.json())
//add cookieParser middleware
app.use(cookieParser())
//connect APIs
app.use('/user-api',userRoute)
app.use('/author-api',authorRoute)
app.use('/admin-api',adminRoute)
app.use('/common-api',commonRouter)
//connect to db
const connectDB=async()=>{
    try{
    await connect(process.env.DB_URL) //later will replace with addr of db server of the db, it shouldn't be in this file since its a evn var
    console.log("DB Connection Success")
    //start http server
    app.listen(process.env.PORT,()=>console.log("server started"))
    } catch(err){
        console.log("Err in database connection",err)
    }
}
connectDB()

//dealing with invalid path
app.use((req,res,next)=>{
    console.log(req.url)
    res.json({message:`${req.url} is invalid path`});
})


//error handling middleware (doesn't forward request to nxt object) we are adding next just to add meaning to the middleware
app.use((err,req,res,next)=>{
  console.error(err)
  res.status(err.status || 500).json({message: err.message || "Internal Server Error"})
})

