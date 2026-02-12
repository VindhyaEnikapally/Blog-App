import {Schema,model} from 'mongoose'



//create user comment schema
const userCommentSchema=new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: String,
    }
})

//create Article Schema
const articleSchema=new Schema({
    author:{
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Author ID required"]
    },
    title:{
        type: String,
        required:[true,"Title is Required"]
    },
    category:{
        type: String,
        required:[true,"Category is Required"]
    },
    content:{
        type: String,
        required:[true,"Content is Required"]
    },
    comments:[userCommentSchema],
    isArticleActive:{
        type: Boolean,
        default:true
    },
},{
    timestamps:true,
    strict:"throw",
    versionKey:false,
});

export const ArticleModel=model("articles",articleSchema);