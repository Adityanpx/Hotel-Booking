import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { registerHotel, checkOwnerStatus } from "../controllers/hotelControl.js";

const router = express.Router();

router.post("/", protect, registerHotel);
router.get("/owner-status", protect, checkOwnerStatus);

export default router;