import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const found = rooms.find((r) => String(r._id) === id);
    if (found) {
      setRoom(found);
      setMainImage(found.images[0]);
    }
  }, [rooms, id]);

  useEffect(() => {
    setIsAvailable(false);
  }, [checkInDate, checkOutDate]);

  if (!room) return null;

  const checkAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error("Please select both dates.");
        return;
      }

      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error("Check-In Date should be before Check-Out Date");
        return;
      }

      setIsLoading(true);
      
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate: checkInDate.trim(),
        checkOutDate: checkOutDate.trim(),
      });

      setIsAvailable(data.isAvailable);
      toast[data.isAvailable ? "success" : "error"](
        data.isAvailable 
          ? "Room is available. You can proceed to book." 
          : "Room is not available."
      );
    } catch (error) {
      toast.error("Error checking availability");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // 1. Final availability check
      const { data: availabilityData } = await axios.post(
        "/api/bookings/check-availability",
        {
          room: id,
          checkInDate,
          checkOutDate
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
          }
        }
      );
  
      if (!availabilityData.isAvailable) {
        setIsAvailable(false);
        toast.error("Room is no longer available");
        return;
      }
  
      // 2. Create booking
      const { data: bookingData } = await axios.post(
        "/api/bookings/book",
        {
          room: id,
          checkInDate,
          checkOutDate,
          guests,
          paymentMethod: "Pay At Hotel"
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await getToken()}`
          }
        }
      );
  
      // 3. Verify successful booking
      if (bookingData.success) {
        toast.success("Booking confirmed!");
        navigate("/my-bookings", { 
          state: { 
            booking: bookingData.booking,
            roomDetails: room 
          } 
        });
      } else {
        throw new Error(bookingData.message || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="py-28 md:py-35 px-4 md:px-26 lg:px-24 xl:px-32">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          {room.hotel.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">79+ reviews</p>
      </div>

      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationFilledIcon} alt="location-icon" />
        <span>{room.hotel.address}</span>
      </div>

      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/1">
          <img
            src={mainImage}
            alt="Room"
            className="h-[320px] md:h-[420px] w-full object-cover rounded-xl shadow-lg"
          />
        </div>
        <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4 lg:overflow-y-auto lg:h-[420px] pr-1">
          {room.images.length > 1 &&
            room.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                className={`h-32 w-full lg:h-36 object-cover rounded-lg cursor-pointer shadow-md ${
                  mainImage === img ? "outline outline-2 outline-orange-500" : ""
                }`}
                alt={`Room ${idx}`}
              />
            ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between mt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-4xl font-playfair">
            Experience Luxury Like Never Before
          </h1>

          <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
            {room.amenities.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
              >
                <img src={facilityIcons[item]} alt={item} className="w-5 h-5" />
                <p className="text-xs">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="tex-2xl font-lg">${room.pricePerNight}/night</p>
      </div>

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
      >
        <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
          <div className="flex flex-col">
            <label htmlFor="checkInDate" className="font-medium">
              Check-In
            </label>
            <input
              type="date"
              id="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="checkOutDate" className="font-medium">
              Check-Out
            </label>
            <input
              type="date"
              id="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              min={checkInDate}
              disabled={!checkInDate}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>

          <div className="w-px h-15 bg-gray-300/70 max-md:hidden"></div>

          <div className="flex flex-col">
            <label htmlFor="guests" className="font-medium">
              Guests
            </label>
            <input
              type="number"
              id="guests"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              max={room.maxGuests || 10}
              className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
              required
            />
          </div>
        </div>

        {!isAvailable ? (
          <button
            type="button"
            onClick={checkAvailability}
            disabled={isLoading}
            className={`bg-primary hover:bg-primary-dull text-white rounded-md max-md:w-full max-md:mt-6 md:px-10 py-3 md:py-4 text-base cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Checking..." : "Check Availability"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-green-600 hover:bg-green-500 text-white rounded-md max-md:w-full max-md:mt-6 md:px-10 py-3 md:py-4 text-base cursor-pointer ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Booking..." : "Book Now"}
          </button>
        )}
      </form>

      <div className="mt-24 space-y-4">
        {roomCommonData.map((spec, index) => (
          <div key={index} className="flex items-start gap-2">
            <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6 h-6" />
            <div>
              <p className="text-base font-medium">{spec.title}</p>
              <p className="text-gray-500 text-sm">{spec.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
        <p>
          Guests will be allocated on the ground floor according to availability...
        </p>
      </div>

      <div className="flex flex-col items-start gap-4">
        <div className="flex gap-4">
          <img
            src={room.hotel.owner.image}
            alt="Host"
            className="h-14 w-14 md:h-16 md:w-16 rounded-full"
          />
          <div>
            <p className="text-lg md:text-xl ">Hosted By {room.hotel.name}</p>
            <div className="flex items-center mt-1">
              <StarRating />
              <p className="ml-2">60+ reviews</p>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetails;