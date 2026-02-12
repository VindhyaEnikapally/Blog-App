import exp from 'express'
import { UserTypeModel } from '../models/UserModel.js'
import { verifyToken } from '../middlewares/verifiedToken.js'
import { register } from '../services/authService.js'

export const adminRoute = exp.Router()


//CREATE ADMIN (Run only once)
adminRoute.post('/users',async(req,res,next) => {
  try {
    const userObj=req.body
    //force role as Admin
    const newAdmin=await register({...userObj,role:"ADMIN"})
    res.status(201).json({message:"Admin created successfully",payload:newAdmin})
  } catch (err) {
    next(err)
  }
})


//Admin middlware
const checkAdmin=(req,res,next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({message:"Access denied. Admin only."})
  }
  next()
}

// block user
adminRoute.put('/block-user/:userId',verifyToken,checkAdmin,
  async (req,res,next)=>{
    try {
      const {userId}=req.params
      const user=await UserTypeModel.findById(userId)
      if (!user) {
        return res.status(404).json({message:"User not found"})
      }
      user.isActive=false
      await user.save()
      res.status(200).json({message:"User blocked successfully",payload:{userId:user._id,isActive:user.isActive}})
    } catch (err) {
      next(err)
    }
  }
)

// unblock user
adminRoute.put('/unblock-user/:userId',verifyToken,checkAdmin,
  async (req,res,next)=>{
    try {
      const {userId}=req.params
      const user=await UserTypeModel.findById(userId)
      if (!user) {
        return res.status(404).json({message:"User not found"})
      }
      user.isActive=true
      await user.save()
      res.status(200).json({message: "User unblocked successfully",payload:{userId: user._id,isActive: user.isActive}})
    } catch (err) {
      next(err)
    }
  }
)
