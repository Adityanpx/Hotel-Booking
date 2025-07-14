import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;
    const { userId } = await req.auth();
    console.log("AUTH USER:", userId);

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const existingHotel = await Hotel.findOne({ owner: userId });
    if (existingHotel) {
      return res.json({ success: false, message: "Hotel already registered by this user" });
    }

    await Hotel.create({ name, address, contact, city, owner: userId });
    await User.findByIdAndUpdate(userId, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    console.error("Error registering hotel:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOwnerStatus = async (req, res) => {
  try {
    const { userId } = await req.auth();
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hotel = await Hotel.findOne({ owner: userId });
    res.json({ success: true, isOwner: !!hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

