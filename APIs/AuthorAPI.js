import exp from 'express'
import {authenticate,register} from '../services/authService.js'
import {ArticleModel} from '../models/ArticleModel.js'
import {UserTypeModel} from '../models/UserModel.js'
import {checkAuthor} from '../middlewares/checkAuthor.js'
import {verifyToken} from "../middlewares/verifiedToken.js";


export const authorRoute=exp.Router()

//Register Author (public Route)
authorRoute.post('/users',async(req,res)=>{
    //get userObj from req 
    let userObj=req.body;
    //call register function
    const newUserObj=await register({...userObj,role:"AUTHOR"}); //if req is reached here then its user role similarly author and admin will work
    //send response
    res.status(201).json({message:"author created",payload:newUserObj})
});

/*
//Authenticate Author (public Route)
authorRoute.post('/authenticate',async(req,res)=>{
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

//create article (protected Route)
authorRoute.post('/articles',verifyToken,async(req,res,next)=>{
  try {
    //get article from request
    const articleObj=req.body;
    //simple validation
    //check if author exists or not(bocz random id can be used to publish the articles it can be by usg postman etc)
    if(!articleObj.author || !articleObj.title || !articleObj.category || !articleObj.content){
      return res.status(400).json({message:"Missing required fields"});
    }
    //create article doc
    const articleDoc=new ArticleModel(articleObj)
    //save article
    const savedArticle=await articleDoc.save()
    //send res
    return res.status(201).json({message:"Article created",payload:savedArticle});
} catch(err) {
    next(err)
  }
})

//read articles of author (he can read inly his articles) (protected Route)
authorRoute.get('/articles/:authorId',verifyToken,checkAuthor,async(req,res,next)=>{
  try {
    const {authorId}=req.params;
    //validate authorId
    if(!authorId){
      return res.status(400).json({ message:"Author ID required" });
    }
    //check if author exists and is AUTHOR
    const author=await UserTypeModel.findOne({_id:authorId,role:"AUTHOR",isActive:true});
    if(!author){
      return res.status(401).json({message:"invalid Author"});
    }
    //fetch articles of author which are active
    const articles=await ArticleModel.find({author:authorId,isArticleActive:true}).populate("author","firstName Email");
    //send response
    res.status(200).json({message:"Articles fetched",payload:articles});
} catch(err){
    next(err);
  }
});

//edit article (protected Route)
authorRoute.put('/articles/:articleId',verifyToken,checkAuthor,async(req,res,next)=>{
  try {
    //get modified article from req
    const {articleId}=req.params;
    const {title,category,content}=req.body;
    if (!articleId) {
      return res.status(400).json({message:"Article ID required"});
    }
    //find article
    const article=await ArticleModel.findById(articleId);
    if (!article || !article.isArticleActive) {
      return res.status(404).json({message:"Article not found"});
    }
    //ensure article belongs to this author
    if (article.author.toString() !== req.body.author) {
      return res.status(403).json({message:"Not allowed to edit this article"});
    }
    //update allowed fields only
    if (title) article.title=title
    if (category) article.category=category
    if (content) article.content=content
    const updatedArticle=await article.save()
    //send response-updated article only
    res.status(200).json({message:"Article updated",payload:updatedArticle});
  } catch (err) {
    next(err)
  }
});

//delete article (i.e, soft delete) (protected Route)
//hard delete- delete article is deleted permanently when method is called, Soft delete- can be retreived anytime when required
authorRoute.put('/articles',verifyToken,checkAuthor,async(req,res,next)=>{
  try {
    //get articleId & authorId from req body
    let {articleId,author}=req.body;
    //validations
    if(!articleId || !author) {
      return res.status(400).json({message:"Article ID & Author ID required"});
    }
    //find article
    let article=await ArticleModel.findById(articleId);
    if (!article || !article.isArticleActive) {
      return res.status(404).json({message:"Article not found"});
    }
    //ensure article belongs to this author
    if(article.author.toString()!==author){
        return res.status(403).json({message:"Not allowed to delete this article"});
    }
    //soft delete
    article.isArticleActive=false;
    let deletedArticle=await article.save();
    // send response
    res.status(200).json({message:"Article deleted",payload:deletedArticle});
} catch (err) {
    next(err);
  }
});
