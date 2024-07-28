import express from "express";
import { login } from "../controllers/auth.js";

const router = express.Router(); //this allows express to identify that these routes will all be configured and allows us to have it in seperate file to keep us organized

router.post("/login", login);

export default router;
