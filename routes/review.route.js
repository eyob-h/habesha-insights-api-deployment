import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", verifyToken, createReview )
router.get("/:businessId", getReviews )
router.delete("/:id",verifyToken, deleteReview)
router.put("/:id",verifyToken, updateReview)

export default router;