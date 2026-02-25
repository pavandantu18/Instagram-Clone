const jwt = require("jsonwebtoken")

async function identifyUser(req,res,next) {
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
            message: "User not authorized"
        })
    }

    console.log(decoded);
    req.user = decoded

    next()
}

module.exports = identifyUser