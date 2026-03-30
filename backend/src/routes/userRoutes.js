import express from "express";
import { saveUser, getAllUsers, updateUser, deleteUser } from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const router = express.Router();


router.post("/saveUser", upload.single("profileImage"), saveUser);
router.post("/updateUser", upload.single("profileImage"), updateUser);


router.get("/getAllUser", getAllUsers);


router.post("/deleteUser/:_id", deleteUser);



export default router;
