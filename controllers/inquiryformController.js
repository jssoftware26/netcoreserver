import inquiryformModel from "../models/inquiryformModel.js"

export const inquiryformdata = async(req, res)=>{
    try{
        const { fullname, email, phone, jobname, services, estimate, projectdetail } = req.body;
        console.log("SUBMIT FORM DATAS:", req.body);
        
        //Save Inquiry Form Data
        const newinquiryformdata = await inquiryformModel.create({
            userId: req.user.id, fullname, email, phone, jobname, services, estimate, projectdetail         
        })
        res.json({
            newinquiryformdata,
            message: "Submited successfully",            
        });
        
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}

export const fetchinquirydatas = async(req, res)=>{
    try{
        const userId = req.user.id;
        console.log("Logged in user id:", userId);

        const fetchinquirydatas = await inquiryformModel.find({ userId });

        console.log("SHOW inquiry datas:", fetchinquirydatas);

        if(fetchinquirydatas.length === 0){
            return res.status(404).json({message: "Your Submitted Inquiry Datas not found"});
        }
        res.status(200).json(fetchinquirydatas);
    }catch(err){
        res.status(500).json({message:"Servre Error"});
    }
}

export const clearinquiryhistory = async(req, res)=>{
    try{
        const userId = req.user.id;
        //Clear Inuqiry History by userId
        const clearInquiryHistory = await inquiryformModel.deleteMany({userId});
        //Check whether any inquiries existd
        if(clearInquiryHistory.deletedCount === 0){
            return res.status(404).json({message:"Nothing in your inquiry history"});
        }

        res.status(200).json({
            message: "Inuqiry history cleared successfully",
            deletedCount: clearInquiryHistory.deletedCount
        })
    }catch(err){
        res.status(500).json({message:"Server Error"});
    }
}