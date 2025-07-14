import { cloudinary } from "../configs/cloudinary.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import User from "../models/User.js";

// ✅ API to create a new room for hotel
export const createRoom = async (req, res) => {
  try {
    const { roomType, pricePerNight, amenities } = req.body;

    const { userId } = await req.auth(); // 🔁 Clerk update
    const hotel = await Hotel.findOne({ owner: userId });

    if (!hotel) return res.json({ success: false, message: "No Hotel Found" });

    // Upload images to Cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      return response.secure_url;
    });

    const images = await Promise.all(uploadImages);

    await Room.create({
      hotel: hotel._id,
      roomType,
      pricePerNight: +pricePerNight,
      amenities: JSON.parse(amenities),
      images,
    });

    res.json({ success: true, message: "Room Created Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ API to get all available rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true })
      .populate({
        path: "hotel",
        populate: {
          path: "owner",
          select: "image name",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching rooms:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to get rooms of the logged-in hotel owner
export const getOwnerRooms = async (req, res) => {
  try {
    const { userId } = await req.auth(); // 🔁 Clerk update
    const hotelData = await Hotel.findOne({ owner: userId });

    if (!hotelData) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found for this user" });
    }

    const rooms = await Room.find({ hotel: hotelData._id }).populate("hotel");

    res.json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching owner's rooms:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to toggle room availability
export const toggleRoomAvailability = async (req, res) => {
  try {
    const { roomId } = req.body;

    const roomData = await Room.findById(roomId);

    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    roomData.isAvailable = !roomData.isAvailable;
    await roomData.save();

    res.json({
      success: true,
      message: "Room availability updated",
      isAvailable: roomData.isAvailable,
    });
  } catch (error) {
    console.error("Error toggling room availability:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
