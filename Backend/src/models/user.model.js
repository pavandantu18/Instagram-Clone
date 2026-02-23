const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: [true, "User name already exists"],
        required: [true, "User name is required"]
    },
    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: [true, "Email is required"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    bio: String,
    profileImage: {
        type: String,
        default: "https://ik.imagekit.io/stvks71ti/360_F_1168505794_IBCEiafsIrHFJ09e65P2vh5115C1XI7e.webp"
    }
})

const userModel = mongoose.model("users_instagram",userSchema)
module.exports = userModel