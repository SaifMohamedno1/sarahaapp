import BlackListedTokens from "../db/Models/black-listed-tokens.model.db.js"
import { verifyToken } from "../Utils/token.utilis.js"
import User from "../db/Models/user.model.js"

export const authenticationMiddleware = async(req,res,next)=>{

    const {accesstoken} = req.headers
    if(!accesstoken){
        return res.status(401).json({message:"Please provide an access token"})
    }

    //check if token starts with bearer
    if(!accesstoken.startsWith("bearer")){
        return res.status(401).json({message:"Invalid token"})
    }

    const token = accesstoken.split(" ")[1]

    // verify the token
    const decodedToken = verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
    if(!decodedToken.id){
        return res.status(401).json({message:"Invalidd token"})
    }

    // check if the token is black listed
    const isTokenBlacklisted = await BlackListedTokens.findOne({tokenId: decodedToken.jti})
    if(isTokenBlacklisted){
        return res.status(401).json({message:"Token is blacklistd"})
    }
    
    // get user data from db
    const user = await User.findById(decodedToken.id)
    if(!user){
        return res.status(404).json({message:"Userrrrr not found"})
    }
    
    req.loggedInUser = {user:{_id:decodedToken.id}, token:{tokenId:decodedToken.jti, expirationDate:decodedToken.exp}}
    next()
}

export default authenticationMiddleware