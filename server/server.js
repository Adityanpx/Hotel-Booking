import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from "@clerk/express";
import { clerkWebhooks } from "./controlers/clerkwebhooks.js";   // keep this path

connectDB();
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

app.get("/", (req, res) => {
  res.send("Api is working...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
