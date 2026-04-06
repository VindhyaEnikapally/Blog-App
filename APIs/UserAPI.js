import exp from "express";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { upload } from "../config/multer.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

export const userRoute = exp.Router();

//Register user
userRoute.post("/users", upload.single("profileImageUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    //getb user obj
    let userObj = req.body;

    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "USER",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "user created",
      payload: newUserObj,
    });
  } catch (err) {
    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
  }
});

//Read all articles(protected route)
userRoute.get("/articles", verifyToken("USER"), async (req, res) => {
  //read articles of all authors which are active
  const articles = await ArticleModel.find({ isArticleActive: true }).populate("comments.user","email firstName");
  //send res
  res.status(200).json({ message: "all articles", payload: articles });
});

//Add comment to an article(protected route)
userRoute.put("/articles", verifyToken("USER"), async (req, res) => {
  try {
    const { articleId, comment } = req.body;
    const user = req.user.userId; // ✅ take from token
    let articleWithComment = await ArticleModel.findOneAndUpdate(
      { _id: articleId, isArticleActive: true },
      { $push: { comments: { user, comment } } },
      { new: true, runValidators: true }
    ).populate("comments.user", "email firstName");
    if (!articleWithComment) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({
      message: "comment added successfully",
      payload: articleWithComment
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//next() ---> next middleware
//next(err) ---> error handling middleware