import jwt from "jsonwebtoken"

export const verifyToken = async(req, res, next)=>{
    const authHeader = req.headers.authorization;

    //console.log("AUTH HEADER:", authHeader);

    //check if authorization header exists
    if(!authHeader){
        return res.status(401).json({message: "No token provided"});
    }

    //expected format : "Bearer ey..........."
    const token = authHeader.split(" ")[1];
    //console.log("TOKEN:", token);
    //console.log("ACCESS SECRET EXISTS:", !!process.env.ACCESS_SECRET);

    //verify JWT
    jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded)=>{
        if(err){
            return res.status(403).json({message:"Invalid or expired token"});
        }
        //console.log("DECODED:", decoded);
        //save decoded payload for later use
        req.user = decoded;
        
        next();
    });
}