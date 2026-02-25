const postModel = require("../models/post.model")
const Imagekit = require("@imagekit/nodejs")
const {toFile} = require("@imagekit/nodejs")
const jwt = require("jsonwebtoken")

const imagekit = new Imagekit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

async function createPostController(req,res) {
    console.log(req.body,req.file);

    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({
            message: "Token not provided, unauthorized access"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
    } catch(e) {
        return res.status(401).json({
            message: "User not authorized"
        })
    }

    const file = await imagekit.files.upload({
        file: await toFile(Buffer.from(req.file.buffer), 'file'),
        fileName: "Test",
        folder: "insta-clone-posts"
    })

    const post = await postModel.create({
        caption: req.body.caption,
        imgUrl: file.url,
        user: decoded.id
    })

    res.status(201).json({
        message: "Post created successfully",
        post
    })
}

async function getPostController(req,res) {
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message: "Token not provided, unauthorized access"
        })
    }

    let decoded = null

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(e) {
        return res.status(401).json({
            message: "Token invalid"
        })
    }

    const userId = decoded.id
    const posts = await postModel.find({
        user: userId
    })

    res.status(200)
        .json({
            message: "Posts fetched successfully.",
            posts
        })
}

async function getPostDetailsController(req,res) {
    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message: "Token not provided, unauthorized access"
        })
    }

    let decoded = null
    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch(e) {
        res.status(401).json({
            message: "Token Invalid"
        })
    }

    console.log(decoded);
    const userId = decoded.id
    const postId = req.params.postId

    const post = await postModel.findById(postId)
    console.log(post)

    if(!post) {
        return res.status(404).json({
            message: "Post not found."
        })
    }

    const isValidUser = post.user.toString() === userId

    if(!isValidUser) {
        return res.status(403).json({
            message: "Forbidden Content."
        })
    }

    return res.status(200).json({
        message: "Post fetched successfully.",
        post
    })
}
module.exports = {
    createPostController,
    getPostController,
    getPostDetailsController
}