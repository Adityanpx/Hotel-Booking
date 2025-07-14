import User from "../models/User.js";
import { Webhook } from "svix";

export const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    /* 1️⃣  Convert raw Buffer to string for signature check */
    const payload = req.body.toString("utf8");
    const headers = {
      "svix-id":        req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    /* 2️⃣  Verify signature & get event */
    const { type, data } = wh.verify(payload, headers);

    /* 3️⃣  Build user doc */
    const userData = {
      _id:      data.id,
      email:    data.email_addresses?.[0]?.email_address,
      username: `${data.first_name} ${data.last_name}`,
      image:    data.image_url,
      role:     "user",
      recentSearchedCities: [],
    };

    /* 4️⃣  Sync with MongoDB */
    if (type === "user.created")   await User.create(userData);
    if (type === "user.updated")   await User.findByIdAndUpdate(data.id, userData);
    if (type === "user.deleted")   await User.findByIdAndDelete(data.id);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).json({ success: false, message: err.message });
  }
};
