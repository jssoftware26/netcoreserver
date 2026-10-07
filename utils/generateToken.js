import jwt from "jsonwebtoken";

export const generateAccessToken = (id)=>{
    console.log("Access Token Expire:", process.env.ACCESS_EXPIRE);
    return jwt.sign(
        {id},
        process.env.ACCESS_SECRET,
        {
            expiresIn: process.env.ACCESS_EXPIRE
        }
    );
};

export const generateRefreshToken = (id)=>{
    console.log("Refresh Token Expire:", process.env.REFRESH_EXPIRE);
    return jwt.sign(
        {id},
        process.env.REFRESH_SECRET,
        {
            expiresIn: process.env.REFRESH_EXPIRE
        }
    );
};