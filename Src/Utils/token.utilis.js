import jwt from 'jsonwebtoken'

// GENERATE TOKEN
export const generateToken = (payload, secret, options)=>{
    return jwt.sign(payload, secret, options)
}

// VERIFY TOKEN
export const verifyToken = (token, secret)=>{
    return jwt.verify(token, secret)
}