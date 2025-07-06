import User from "../models/User.js";
import { Webhook } from "svix";
import express from "express";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 1️⃣  raw body – string किंवा Buffer
    const payload = req.body;          // because we used express.raw()
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // 2️⃣  verify → event मिळवा
    const evt = wh.verify(payload, headers);   // throws if invalid
    const { type, data } = evt;

    // 3️⃣  MongoDB मध्ये Sync करा
    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        await User.create(userData);
        break;
      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        console.log("अपरिचित इव्हेंट:", type);
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};

/* server.js मधे 🔽 */
app.post(
  "/clerk/webhook",
  express.raw({ type: "application/json" }), // ⇦ raw body
  clerkWebhooks
);
