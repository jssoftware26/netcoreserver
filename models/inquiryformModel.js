import mongoose from "mongoose";

const inquiryformSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true
    },
    fullname:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    jobname:{
        type:String,
        required: true
    },
    services:{
        type:[String],
        required: true
    },
    estimate:{
        type:String,
        required: true
    },
    projectdetail:{
        type:String,
        required: true
    }
},{
    timestamps: true
});

const inquiryformModel = mongoose.model("inquiryformdata", inquiryformSchema);
export default inquiryformModel;