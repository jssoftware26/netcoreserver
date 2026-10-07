import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
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
    }
},{
    timestamps: true
});

const accountModel = mongoose.model("account", accountSchema);
export default accountModel;