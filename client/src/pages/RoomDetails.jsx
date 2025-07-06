import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, facilityIcons, roomCommonData, roomsDummyData } from "../assets/assets";
import StarRating from "../components/StarRating";

const RoomDetails = () => {
  const { id } = useParams();

  // CHANGE: start with null (not "nul") so we can test for “not‑ready”
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    // CHANGE: cast _id to string so the types match the string from useParams()
    const found = roomsDummyData.find((r) => String(r._id) === id);

    if (found) {
      setRoom(found);
      setMainImage(found.images[0]);
    }
  }, [id]); // CHANGE: include id in dependencies so it reruns on route change

  // CHANGE: simple fallback while data is loading (you could put a spinner here)
  if (!room) return null;

  return (
    <div className="py-28 md:py-35 px-4 md:px-26 lg:px-24 xl:px-32">
      {/* Heading */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
        <h1 className="text-3xl md:text-4xl font-bold">
          {room.hotel.name}{" "}
          <span className="font-inter text-sm">({room.roomType})</span>
        </h1>
        <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
          20% OFF
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 mt-2">
        <StarRating />
        <p className="ml-2">79+ reviews</p>
      </div>

      {/* Address */}
      <div className="flex items-center gap-1 text-gray-500 mt-2">
        <img src={assets.locationFilledIcon} alt="location-icon" />
        <span>{room.hotel.address}</span>
      </div>

      {/* Images */}
      <div className="mt-6 flex flex-col lg:flex-row gap-6">
        {/* MAIN image – narrower and shorter */}
        <div className="w-full lg:w-1/1">
          <img
            src={mainImage}
            alt="Room"
            className="h-[320px] md:h-[420px]   /* ↓ shorter */
                 w-full object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* THUMBNAILS – bigger thumbs in a 2‑col grid */}
        <div
          className="w-full lg:w-1/2          /* ↑ wider strip */
               grid grid-cols-2 gap-4 
               lg:overflow-y-auto lg:h-[420px] pr-1"
        >
          {room.images.length > 1 &&
            room.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                onClick={() => setMainImage(img)}
                className={`h-32 w-full lg:h-36   /* ↑ larger thumbs */
                     object-cover rounded-lg cursor-pointer shadow-md ${
                       mainImage === img
                         ? "outline outline-2 outline-orange-500"
                         : ""
                     }`}
                alt={`Room ${idx}`}
              />
            ))}
        </div>
      </div>
      {/* Room Highlights */}
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
  className="flex flex-col md:flex-row items-start md:items-center justify-between
             bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] 
             p-6 rounded-xl mx-auto mt-16 max-w-6xl"
>
  {/* Input Group */}
  <div className="flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500">
    <div className="flex flex-col">
      <label htmlFor="checkInDate" className="font-medium">
        Check-In
      </label>
      <input
        type="date"
        id="checkInDate"
        placeholder="Check-In"
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
        placeholder="Check-Out"
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
        placeholder="Check-In"
        className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
        required
      />
    </div>
    {/* You can add more fields like check-out, guests, etc., here */}
  </div>

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-primary hover:bg-primary-dull active:scale-95 transition-all
               text-white rounded-md max-md:w-full max-md:mt-6 
               md:px-10 py-3 md:py-4 text-base cursor-pointer"
  >
    Check Avaibility
  </button>
</form>
{/* Common Specifications */}
<div className="mt-24 space-y-4">
  {roomCommonData.map((spec, index) => (
    <div key={index} className="flex items-start gap-2">
      <img
        src={spec.icon}
        alt={`${spec.title}-icon`} // ✅ FIXED: template literal
        className="w-6 h-6" // ✅ FIXED: Tailwind doesn't support `w-6.5`
      />
      <div>
        <p className="text-base font-medium">{spec.title}</p>
        <p className="text-gray-500 text-sm">{spec.description}</p>
      </div>
    </div>
  ))}
</div>
{/* Hotel Info Section */}
<div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
  <p>
    Guests will be allocated on the ground floor according to availability.
    You get a comfortable two-bedroom apartment that has a true city feeling.
    The price quoted is for two guests. At the guest slot, please mark the number
    of guests to get the exact price for groups. Guests will be allocated to the
    ground floor according to availability. You get a comfortable two-bedroom apartment
    that has a true city feeling.
  </p>
</div>

{/* Hosted by */}
<div className="flex flex-col items-start gap-4">
  <div className="flex gap-4">
    <img
      src={room.hotel.owner.image}
      alt="Host"
      className="h-14 w-14 md:h-16 md:w-16 rounded-full "
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
