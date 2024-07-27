import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"; //this is a routes folder which has path and routers for every type of feature
// import { error } from "console";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
// import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import {users, posts} from "./data/index.js";

// CONFIGURATIONS middleware and different package configs
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); //sets the directory where we keep our assets, irl we store it in a directory 

// FILE STORAGE: this code got from multer github repo
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/assets"); //when someone upload a file its saved this folder
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const upload = multer({ storage }); //var used to upload a file

// AUTHENTICATION: when you register and login
//AUTHORIZATION: when you wan to make sure some one is logged in, so you perform certain actions
//only users who are logged in can get posts/likes

// ROUTES WITH FILES
// when we create a post user should be able to upload a pic
app.post("/post", verifyToken, upload.single("picture"), createPost); //when we send from the front-end the pic, this prop grabs the pic: "upload.single("picture")", here is where image located in http call, it will grab and upload it

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register); //this should be in /routes/auth.js, but we put here caz we need the upload variable(just above you can see)

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001; //if process.env.PORT not work 6001 will
mongoose.connect(process.env.MONGO_URL, { //connecting to actual db from node server
    useNewUrlParser: true, //`node --trace-warnings ...`
    useUnifiedTopology: true,
}).then(() =>{
    app.listen(PORT, () => console.log(`Connected successfully: Server Port: ${PORT}`));
    
    // ADD DATA ONE TIME
    //when we start this up we manually inject this info
    // User.insertMany(users);
    // Post.insertMany(posts);

}).catch((error) => console.log(`${error} did not connect`));


