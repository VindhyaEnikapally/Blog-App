import {UserTypeModel} from "../models/UserModel.js"

export const checkAuthor=async (req,res,next)=>{
  try {
    // get authorId (from params or body)
    const authorId=req.params?.authorId||req.body?.author; //works for POST & PUT requests
    if (!authorId) {
      return res.status(400).json({message:"Author ID required"});
    }
    // verify author
    const author=await UserTypeModel.findById(authorId)
    if (!author) {
      return res.status(401).json({message:"Invalid Author"});
    }
    //if author found but role is different
    if (author.role !== "AUTHOR") {
      return res.status(403).json({message:"Access denied"});
    }
    //if author is blocked by admin
    if(!author.isActive){
        return res.status(403).json({message:"Author account is not active"});
    }
    /*attach author to request (optional but useful)
    req.author=author 
    */
    //move to next middleware
    next()
} catch (err) {
    next(err)
  }
}
