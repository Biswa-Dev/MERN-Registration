const jwt = require('jsonwebtoken');
const User = require('../models/userschema');

const Authenticate = async (req,res,next)=>{
    try{
        const token = req.cookies.jwtoken;
        const verifyToken = jwt.verify(token,process.env.TOKEN_SECRET);

        const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token});

        if(!rootUser){
            throw new Error("User not Found!!!");
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userId = rootUser._id;

        next();
    }catch(err){
        res.status(401).send("Unauthorised User Request!!!");
        console.log(err);
    }
}

module.exports = Authenticate; 