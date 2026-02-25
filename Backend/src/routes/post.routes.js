const express = require("express")
const postController = require("../controllers/post.controller")
const postRouter = express.Router()
const multer = require("multer")
const upload = multer({storage: multer.memoryStorage()})
const identifyUser = require("../middlewares/auth.middleware")

/**
 * @routes Post /api/posts [protected]
 * @description Create a post with the content and image provided in the req.body
 * - req.body = {caption, image-file}
 */

postRouter.post("/",upload.single("image"), identifyUser, postController.createPostController)

/**
 * @route GET /api/posts/ [protected]
 * @description Get all the posts created by the user that request come from.
 */

postRouter.get("/", identifyUser, postController.getPostController)

/**
 * @route GET /api/posts/details/:postid
 * @description return an detail about specific post with the id. Also check whether the post
 * belongs to the user that the request come from
 */

postRouter.get("/details/:postId", identifyUser, postController.getPostDetailsController)

/**
 * @routes POST /api/posts/like/:postid
 * @description like a post with the id provided in the request params.
 */

postRouter.post("/like/:postId", identifyUser, postController.likePostController)

module.exports = postRouter