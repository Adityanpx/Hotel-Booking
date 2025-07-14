import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controllers/clerkwebhooks.js";   // keep this path
import userRouter from "./routes/userRoutes.js";
import { connectCloudinary } from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import hotelRoutes from './routes/hotelRoute.js';


connectDB();
connectCloudinary();

const app = express();

app.use(cors());
app.use(clerkMiddleware());          // ✅ Clerk auth on every request

/* ---------- Clerk webhook: RAW body BEFORE JSON parser ---------- */
app.post(
  "/api/clerk",                      // ⬅︎  keep this exactly the same as Clerk endpoint
  express.raw({ type: "application/json" }),
  clerkWebhooks
);
/* ---------------------------------------------------------------- */

// JSON parser for every other route (after webhook!)
app.use(express.json());
app.use('/api/user', userRouter);
app.use('/api/rooms', roomRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/hotels', hotelRoutes);




app.get("/", (req, res) => {
  res.send("Api is working...");
});
console.log("Connecting to MongoDB URI:", process.env.MONGODB_URL);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
