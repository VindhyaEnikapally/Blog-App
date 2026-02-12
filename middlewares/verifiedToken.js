import jwt from "jsonwebtoken";
import { config } from "dotenv";

export const verifyToken=(req,res,next)=>{
  try {
    let token=req.cookies?.token;
    if (!token) {
      return res.status(401).json({message:"Token missing"});
    }
    let decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decoded;
    next();
  } catch (err) {
    return res.status(401).json({message:"Invalid token"});
  }
};
