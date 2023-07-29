import express from "express";
import {
  createBusiness,
  deleteBusiness,
  updateBusiness,
  getBusiness,
  getBusinesses
} from "../controllers/business.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifyToken, createBusiness);
router.delete("/:id", verifyToken, deleteBusiness);
router.put("/:id", verifyToken, updateBusiness);
router.get("/single/:id", getBusiness);
router.get("/", getBusinesses);

export default router;