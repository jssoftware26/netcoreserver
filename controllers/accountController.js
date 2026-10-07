import emailverifyModel from "../models/emailverifyModel.js";
import accountModel from "../models/accountModel.js";
import { sendVerificationEmail } from "../utils/emailservice.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const createaccount = async(req, res)=>{
    try{
        const { username, emailaddress, password, phonenumber } = req.body;
        console.log("REQ DATAS:", req.body);

        //NormalizedEmail
        const normalizedEmail = emailaddress
            .trim()
            .toLowerCase();
        console.log("NORMALIZED EMAIL:", normalizedEmail);

        //Check if email already exists
        const existEmail = await accountModel.findOne({emailaddress: normalizedEmail});
        console.log("EXISTING EMAIL:", existEmail);
        if(existEmail){
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        //Generate OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();
        console.log("GENERATED OTP:", otp);

        //OTP expires in 5 minutes
        const otpExpiresAt = new Date(
            Date.now() + 5 * 60 * 1000
        );
        console.log("OTP EXPIRES:", otpExpiresAt);

        //Remove previous verification
        await emailverifyModel.deleteMany({
            emailaddress: normalizedEmail
        });
        console.log("OLD VERIFICATION REMOVED");
        
        //Save temporary registration
        const newAccount = await emailverifyModel.create({
            username, emailaddress: normalizedEmail, password, phonenumber, otp, otpExpiresAt
        });
        console.log("ACCOUNT CREATED:", newAccount._id);

        //Send OTP email
        console.log("SENDING VERIFICATION EMAIL...");
        await sendVerificationEmail(
            normalizedEmail, otp
        )
        console.log("VERIFICATION EMAIL SENT");

        //Response
        return res.status(200).json({
            message: "Verification code sent",
            emailaddress: normalizedEmail
        })        
    }catch(err){
        console.log("CREATE ACCOUNT ERROR:", err);
        res.status(500).json({
            message: "Failed to send verification email"
        });
    }
}

export const verifyotp = async(req, res)=>{
    try{
        const { username, emailaddress, password, phonenumber, otp } = req.body;
        console.log("VERIFY OTP DATAS:", req.body);

        //check required data
        if(!emailaddress?.trim() || !otp?.trim()){            
            return res.status(400).json({
                message:"OTP Code is required"
            });
        }

        //normalize email
        const normalizedEmail = emailaddress
            .trim()
            .toLowerCase();            

        //find verification record
        const verification = await emailverifyModel.findOne({
            emailaddress: normalizedEmail
        });
        console.log("VERIFICATION RECORD:", verification);

        if(!verification){            
            return res.status(404).json({message:"Verification record not found"});
        }

        //check otp        
        if(verification.otp !== otp){            
            return res.status(400).json({message:"Invalid verification code"});
        }

        //check expiration
        if(verification.otpExpiresAt < new Date()){
            return res.status(400).json({message:"Verification code has expired"});
        }

        //Save Real Account Datas if verify OK
        const hashPassword = await bcrypt.hash(password, 8);
        const saveAccount = await accountModel.create({
            username, emailaddress: normalizedEmail, password:hashPassword, phonenumber
        });
        console.log("SAVE ACCOUNT:", saveAccount._id);
        
        return res.status(200).json({
            message: "Email verified successfully"
        });        
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Server error"
        })
    }
}

export const loginaccount = async(req, res)=>{
    try{
        const { emailaddress, password } = req.body;
        console.log("REQ DATAS:", req.body);
        
        //NormalizedEmail
        const normalizedEmail = emailaddress
            .trim()
            .toLowerCase();
        console.log("NORMALIZED EMAIL:", normalizedEmail);

        //Check if email already exists
        const existEmail = await accountModel.findOne({emailaddress: normalizedEmail});
        console.log("EXISTING EMAIL:", existEmail);
        if(!existEmail){
            return res.status(400).json({
                message: "Invalid email address"
            });
        }

        //Compair matched bcrypt password
        const matchPassword = await bcrypt.compare(password, existEmail.password);
        if(!matchPassword){
            return res.status(401).json({message:"Wrong password"});
        }

        //Create accessToken & refreshToken
        const accessToken = generateAccessToken(existEmail._id);
        const refreshToken = generateRefreshToken(existEmail._id);

        //Set refresh token cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,    //true in production (HTTPS)
            sameSite: "lax",
            maxAge: 60 * 24 * 60 * 60 * 1000
        });

        //Return access token
        res.json({
            accessToken,
            user:{
                id: existEmail._id,           
                username: existEmail.username,   
                emailaddress: existEmail.emailaddress
            }
        })

    }catch(err){
        res.status(500).json({message: "Server Error"})
    }
}

export const fetchaccdatas = async(req, res)=>{
    try{
        const userId = req.user.id;
        const fetchAccDatas = await accountModel.findById(userId);

        if(!fetchAccDatas){
            return res.status(404).json({message:"Account not found"});
        }
        res.status(200).json(fetchAccDatas);
    }catch(err){
        res.status(500).json({message: "Server Error"});
    }
}

export const refresh = async(req, res)=>{
    const refreshToken = req.cookies?.refreshToken;

    if(!refreshToken){
        return res.status(401).json({message:"No refresh token"})
    };

    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded)=>{
        if(err){
            return res.status(403).json({message:"Refresh token expired"})
        }
        const accessToken = generateAccessToken(decoded.id);
        res.json({accessToken});
    })
}