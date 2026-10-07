import "dotenv/config";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/route.js";

import "./config/mongodb.js";

const app = express();

app.use(cors({
    origin:"https://netcoresoftware.onrender.com",
    credentials: true
}));

//Express Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//Route
app.use("/api", router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`Server running on ${PORT}`);
})