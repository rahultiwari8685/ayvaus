import express from "express";
import { auth } from "../middlewares/auth.js";

import {
  getUsers,
  blockUser,
  unblockUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/admin/list", auth, getUsers);

router.put("/admin/block/:id", auth, blockUser);

router.put("/admin/unblock/:id", auth, unblockUser);

export default router;
