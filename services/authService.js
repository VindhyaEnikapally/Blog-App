import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { UserTypeModel } from "../models/UserModel.js"
import { config } from "dotenv"
config()

//register
export const register=async(userObj)=> {
  const userDoc=new UserTypeModel(userObj)
  // validate required fields
  await userDoc.validate()
  // hash password
  userDoc.password=await bcrypt.hash(userDoc.password,10)
  // save user
  const createdUser=await userDoc.save()
  // remove password before sending
  const newUserObj=createdUser.toObject()
  delete newUserObj.password
  return newUserObj
}

//Authenticate (LOGIN)
export const authenticate=async ({email,password,role})=> {
  // validate input
  if (!email || !password || !role) {
    const err=new Error("Email, password and role are required")
    err.status=400
    throw err
  }
  // check user with email + role
  const user=await UserTypeModel.findOne({email,role})
  if (!user) {
    const err=new Error("Invalid email or role")
    err.status=401
    throw err
  }
  // check password
  const isMatch=await bcrypt.compare(password, user.password)
  if (!isMatch) {
    const err=new Error("Invalid password")
    err.status=401
    throw err
  }
  //check isActive state
  if (user.isActive==false) {
    const err=new Error("Your Account is blocked,please contact Admin");
    err.status=403;
    throw err;
  }
  // generate JWT
  const token=jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  )
  // remove password before sending
  const userObj=user.toObject()
  delete userObj.password
  return {token,user:userObj}
}
