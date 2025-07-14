// roomRoutes.js

import express from "express";
import upload from "../middleware/uploadMiddleware.js"; // ✅ Fixed typo in path
import { protect } from "../middleware/authMiddleware.js";
import { createRoom } from "../controllers/roomController.js";
import { getOwnerRooms, getRooms, toggleRoomAvailability } from "../controllers/roomController.js";

const roomRouter = express.Router();

// Route to create a room with max 4 images
roomRouter.post("/", upload.array("images", 4), protect, createRoom);
roomRouter.get('/', getRooms);
roomRouter.get('/owner', protect , getOwnerRooms);
roomRouter.post('/toggle-availability', protect , toggleRoomAvailability)

export default roomRouter;
