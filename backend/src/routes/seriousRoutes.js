import express from "express";
import { loginUser } from "../controllers/authController.js";
import { registerUser } from "../controllers/registerUser.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
