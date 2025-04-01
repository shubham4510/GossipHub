import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()


export const verifyToken = async (req,res,next) => {
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({success:false,message:"You are not authenticated!"});
    }

    jwt.verify(token,process.env.JWT_KEY,(error,payload)=>{
        if(error)return res.status(403).json({
            success:false,
            message:"Token is not valid"
        })
        req.userId = payload.userId;
        next()
    })
}