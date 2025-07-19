import React, { useEffect, useState } from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);
  console.log("🔍 rooms:", rooms);
  console.log("🔍 searchedCities:", searchedCities);

  useEffect(() => {
    if (Array.isArray(rooms) && Array.isArray(searchedCities)) {
      const filteredHotels = rooms.filter(
        (room) => room?.hotel?.city && searchedCities.includes(room.hotel.city)
      );
      setRecommended(filteredHotels);
    }
  }, [rooms, searchedCities]);

  if (!Array.isArray(rooms) || !Array.isArray(searchedCities)) {
    return <div className="text-center py-20 text-gray-500">Loading rooms...</div>;
  }

 

  return recommended.length > 0 && (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
      <Title 
        title="Recommended Hotels"
        subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
      />
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {recommended.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedHotels;
