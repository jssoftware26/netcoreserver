import mongoose from "mongoose";

const emailverifySchema = new mongoose.Schema({
    username:{
        type:String,
        required: true
    },
    emailaddress:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    phonenumber:{
        type:String,
        required: true
    },
    otp:{
        type:String,
        required: true
    },
    otpExpiresAt:{
        type:Date,
        required: true
    }
},
{
    timestamps: true
});

const emailverifyModel = mongoose.model("emailverify", emailverifySchema);
export default emailverifyModel;