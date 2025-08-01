import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const HotelCard = ({ room, index }) => {
  if (!room?.hotel) return null;

  return (
    <Link
      to={`/rooms/${room._id}`}
      onClick={() => scrollTo(0, 0)}
      className="min-w-[280px] max-w-[300px] w-full rounded-xl overflow-hidden bg-white text-gray-500/90 shadow-md flex-shrink-0"
    >
      <img
        src={room.images[0]}
        alt="room"
        className="w-full h-56 object-cover"
      />
      {index % 2 === 0 && (
        <p className="px-3 py-1 absolute top-3 left-3 text-xs bg-white text-gray-800 font-medium rounded-full">
          Best Seller
        </p>
      )}
      <div className="p-4 pt-5">
        <div className="flex items-center justify-between">
          <p className="font-outfit text-xl font-medium text-gray-800">{room.hotel.name}</p>
          <div className="flex items-center gap-1">
            <img src={assets.starIconFilled} alt="star-Icon" className="w-4 h-4" /> 4.5
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm mt-1">
          <img src={assets.locationFilledIcon} alt="location-icon" className="w-4 h-4" />
          <span>{room.hotel.address}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p>
            <span className="text-xl text-gray-800">${room.pricePerNight}</span>/night
          </p>
          <button className="px-4 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer">
            Book Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
  