import express from "express";
const router = express.Router();

//Import Controllers
import { createaccount, verifyotp, loginaccount, fetchaccdatas, refresh} from "../controllers/accountController.js";
import { inquiryformdata, fetchinquirydatas, clearinquiryhistory} from "../controllers/inquiryformController.js";
import { verifyToken } from "../middlewares/verifytokenMiddleware.js";

router.post("/createaccount", createaccount);
router.post("/verifyotp", verifyotp);
router.post("/loginaccount", loginaccount);
router.post("/sendinquiryformdata", verifyToken, inquiryformdata);
router.get("/fetchaccdatas", verifyToken, fetchaccdatas);
router.get("/fetchinquirydatas", verifyToken, fetchinquirydatas);
router.delete("/clearinquiryhistory", verifyToken, clearinquiryhistory);

router.post("/refresh", refresh);

export default router;