import exp from 'express'
import {authenticate} from '../services/authService.js'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifiedToken.js'
import bcrypt from "bcryptjs"; 

export const commonRouter = exp.Router()

//login (for USER/AUTHOR/ADMIN)
commonRouter.post('/authenticate',async(req,res,next)=>{
  try {
    const userCred=req.body
    const {token,user}=await authenticate(userCred)
    res.cookie("token",token,{
      httpOnly: true,
      sameSite: "lax",
      secure: false
    })
    res.status(200).json({message:"login success",payload:user})
  } catch (err) {
    next(err)
  }
})

//logout
commonRouter.post('/logout',(req,res)=>{
  res.clearCookie("token",{
    httpOnly: true,
    sameSite: "lax",
    secure: false
  })
  res.status(200).json({message:"logged out successfully"})
})

//change password
commonRouter.put('/change-password',verifyToken,async(req,res,next)=>{
    try{
        //get curr password and new password
        const {currentPassword,newPassword}=req.body
        //find logged-in user using id  from token
        const user = await UserTypeModel.findById(req.user.userId)
        if(!user){
            return res.status(404).json({message:"User Not found"})
        }
        //check if current password is correct
        const isMatch=await bcrypt.compare(currentPassword,user.password)
        if(!isMatch){
            return res.status(401).json({message:"Current password is incorrect"})
        }
        //replace curr password with new password i.e,hash the new password
        user.password=await bcrypt.hash(newPassword,10)
        await user.save()
        //send response
        return res.status(200).json({message:"Password changed successfully"})
    } catch (err) {
    next(err)
  }
})

