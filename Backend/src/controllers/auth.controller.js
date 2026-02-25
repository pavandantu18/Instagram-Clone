const userModel = require("../models/user.model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function registerController(req, res) {
    const { email, userName, password, bio, profileImage } = req.body

    // const isUserExistsByEmail = await userModel.findOne({email})

    // if(isUserExistsByEmail) {
    //     return res.status(409).json({
    //         message: "user already exists with same email"
    //     })
    // }

    // const isUserExistsByUsername = await userModel.findOne({username})

    // if(isUserExistsByUsername) {
    //     return res.status(409).json({
    //         message: "user already exists by username"
    //     })
    // }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [
            { userName },
            { email }
        ]
    })

    if (isUserAlreadyExists) {
        return res.status(409)
            .json({
                message: "User already exists " + (isUserAlreadyExists.email === email
                    ? "with this email" : "with this username")
            })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        userName,
        email,
        bio,
        profileImage,
        password: hash
    })

    /**
     * - There must be user data
     * - and data must be unique before creating token
     */

    const token = jwt.sign(
        {
            id: user._id,
            username: user.userName
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token",token)
    res.status(201).json({
        message: "User registered successfully",
        user: {
            email: user.email,
            username: user.userName,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

async function loginController(req,res) {
    const {userName, email, password} = req.body

    /**
     * username
     * password
     * 
     * email
     * password
     */

    const user = await userModel.findOne({
        $or: [
            {
                userName: userName
            },
            {
                email: email
            }
        ]
    })

    if(!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(401).json({
            message: "Password invalid"
        })
    }

    const token = jwt.sign(
        {
            id:user._id,
            username: user.userName
        },
        process.env.JWT_SECRET,
        {expiresIn: "1d"}
    )

    res.cookie("token", token)

    res.status(200)
    .json({
        message: "User loggedin successfully",
        user: {
            userName: user.userName,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage
        }
    })
}

module.exports = {
    registerController,
    loginController
}