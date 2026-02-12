import exp from 'express'
import {authenticate,register} from '../services/authService.js'
import {verifyToken} from '../middlewares/verifiedToken.js'
import {ArticleModel} from '../models/ArticleModel.js'
export const userRoute=exp.Router()

//Register User 
userRoute.post('/users',async(req,res)=>{
    //get userObj from req 
    let userObj=req.body;
    //call register function
    const newUserObj=await register({...userObj,role:"USER"}); //if req is reached here then its user role similarly author and admin will work
    //send response
    res.status(201).json({message:"user created",payload:newUserObj});
})
/*
//Authenticate User (login) (role must be supplied here else server need to do extra job)
userRoute.post('/authenticate',async(req,res)=>{
    //get user cred object (contains whatever send by the client)
    let userCred=req.body;
    //call authenticate service
    let {token,user}=await authenticate(userCred);
    //save token as httpOnly cookie
    res.cookie("token",token,{
        httpOnly:true,
        sameSite:"lax",
        secure:false,
    });
    //send res
    res.status(200).json({message:"login success",payload:user})
})

*/

//Read all articles (protected Route)
userRoute.get('/users',verifyToken,async(req,res)=>{
    //fetch all published articles
    const articles=await ArticleModel.find({status:"published"});
    res.status(200).json({message:"article list",payload:articles});
})

//Add comment to an article (protected Route)
userRoute.post('/articles/:articleId/comments',verifyToken,async(req,res)=>{
    //get articleId from url
    const {articleId}=req.params;
    //create comment object
    const comment={
        commentedBy:req.user.username, //comes from JWT
        comment:req.body.comment,
        commentedAt:new Date()
    }
    //push comment to article
    const updatedArticle=await ArticleModel.findByIdAndUpdate(articleId,{$push:{comments:comment}},{new:true})
    res.status(200).json({message:"comment added",payload:updatedArticle})
});

// Logout
userRoute.post("/logout",(req,res)=>{
  res.clearCookie("token");
  res.status(200).json({message:"Logged out"});
});
