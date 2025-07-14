import User from "../models/User.js";

export const protect = async (req, res, next) => {
  console.log("\uD83D\uDD10 PROTECT: ", req.originalUrl);
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Not Authenticated" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};
