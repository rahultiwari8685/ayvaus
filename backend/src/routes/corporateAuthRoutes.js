import express from "express";

import {
  registerEmployee,
  registerCompany,
  corporateLogin,
} from "../controllers/corporateAuthController.js";

const router = express.Router();

router.post("/register/employee", registerEmployee);
router.post("/register/company", registerCompany);
router.post("/login", corporateLogin);

export default router;
