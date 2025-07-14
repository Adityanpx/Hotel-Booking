import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js"



// Function to check room availability between check-in and check-out dates
const checkAvailability = async (checkInDate, checkOutDate, room) => {
    try {
      const bookings = await Booking.find({
        room,
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
      });
  
      const isAvailable = bookings.length === 0;
      return isAvailable;
    } catch (error) {
      console.error("Error checking availability:", error.message);
      return false;
    }
  };
  
  export default checkAvailability;

  // POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
      const { room, checkInDate, checkOutDate } = req.body;
  
      if (!room || !checkInDate || !checkOutDate) {
        return res.status(400).json({
          success: false,
          message: "Room, check-in date, and check-out date are required",
        });
      }
  
      const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);
  
      res.json({ success: true, isAvailable });
    } catch (error) {
      console.error("Availability check failed:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };

//API to create new booking
// POST /api/bookings/book

export const createBooking = async (req , res) => {
    try {
        const {room , checkInDate , checkOutDate, guests} = req.body;
        const user = req.user._id;

        // Before Booking Check Availability
        const isAvailable = await checkAvailability({
            checkInDate,
            checkOutDate,
            room

        })
        if (!isAvailable) {
            return res.json({success: false, message: "Room is not Available"})
        }

        //Get totalprice from room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //Calculate totalPrice based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

        totalPrice *= nights;
        const booking = await Booking.create({
            user,
            room,
            hote: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        })

        res.json({success: true , message: "Booking created Successfully"});

    } catch (error) {
        console.log(error);
        res.json({success: false , message: "Failed to create booking"});

        
    }
};

//API to get all bokkings for user
//GET /api/bookings/user
export const getUserBookings = async (req, res) => {
  try {
    const user = req.user._id;

    const bookings = await Booking.find({ user })
      .populate({
        path: "room",
        populate: { path: "hotel" }, // get hotel inside room
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

export  const getHotelBookings = async (req, res ) => {
  try {
    const hotel = await Hotel.finfOne({owner: req.auth.userId});
  if (!hotel) {
    return res.json({success: false, message: "No Hotel Found"});
  }
  const bookings = await Booking.find({hotel:hotel._id}).populate("room hotel user").sort({createdAt: -1});

  //total Bookings

  const  totalBookings = bookings.length;
  //total revenue
  const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice , 0);

  res.json({success: true, messsage: {totalBookings , totalRevenue , bookings}});
  } catch (error) {
    res.json({success: false, messsage: "Failed to fetch bookings"});

  }
}
