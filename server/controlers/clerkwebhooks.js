import User from "../models/User.js";
import { Webhook } from "svix";
import express from "express";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body; // raw body if express.raw() is used
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const evt = wh.verify(payload, headers);
    const { type, data } = evt;

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
        break;
    }

    res.status(200).json({ success: true, message: "Webhook received" });
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
};
