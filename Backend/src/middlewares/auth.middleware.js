const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
    console.log("Cookies:", req.cookies);
    console.log("Authorization Header:", req.headers.authorization);

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Extracted Token:", token);

    if (!token) return res.status(401).json({
        message: "Token not provided."
    });

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({token});

    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "Token is invalid"
        })
    }

    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message : "Invalid Token"
        })
    }

}

module.exports = {authUser};  