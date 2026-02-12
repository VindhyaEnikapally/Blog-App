import { Schema,model } from "mongoose";

const userSchema=new Schema({
    firstName:{
        type:String, //mongoose schema type i.e, String
        required: [true, "First Name is required"]
    },
    lastName:{
        type: String,
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique:[true,"Email already Exists"]
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    profileImageUrl:{
        type:String,
    },
    role:{
        type: String,
        enum:["AUTHOR","USER","ADMIN"], //checks thr role and allows them accordingly
        required: [true, "Role is required"]//{Value} curr val entered by the user
    },
    isActive:{
        type: Boolean,
        default: true,
    },
},{
    timestamps:true,
    strict:"throw",
    versionKey: false
})

//create model
export const UserTypeModel=model("users",userSchema)
