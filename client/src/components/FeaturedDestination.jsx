import React from 'react'
import HotelCard from './HotelCard'
import Title from './Title'
import { useAppContext } from '../context/AppContext'

const FeaturedDestination = () => {
  const { rooms, navigate } = useAppContext();
  console.log("Rooms from context:", rooms);

  if (!rooms) return <div className="text-center py-20 text-gray-500">Loading rooms...</div>;
  if (rooms.length === 0) return <div className="text-center py-20 text-gray-500">No rooms found.</div>;

  return (
    <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>

      <Title 
        title="Featured Destination"
        subtitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"
      />
      <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
        {rooms.slice(0, 4).map((room, index) => (
          <HotelCard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button
        onClick={() => { navigate("/rooms"); scrollTo(0, 0); }}
        className='my-16 px-6 py-3 text-xl font-bold border border-gray-400 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'
      >
        View All Destinations....✈️
      </button>
    </div>
  )
}

export default FeaturedDestination
