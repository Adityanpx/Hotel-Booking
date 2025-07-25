import React, { useState } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Hero = () => {
  const {navigate , getToken , axios , setSearchedCities} = useAppContext();
  const [destination , setDestination] = useState("");

  const onSearch = async (e) => {
    e.preventDefault();
    if (!destination) return;
    navigate(`/rooms?destination=${destination}`);

    // Call API to save recent searched cities
    await axios.post('/api/user/store-recent-search', {recentSearchedCity: destination},
      {headers: {Autorization: `Bearer ${await getToken()} `}});

    // Add destination to searchedCities (max 3 recent searched cities)
    setSearchedCities((prevSearchedCities) => {
      const updatedSearchedCities = [...prevSearchedCities];
      if (destination && !updatedSearchedCities.includes(destination)) {
        updatedSearchedCities.push(destination);
        if (updatedSearchedCities.length > 3) {
          updatedSearchedCities.shift();
        }
      }
      return updatedSearchedCities;
    });
  }

  const handleCityClick = (city) => {
    setDestination(city);
    navigate(`/rooms?destination=${city}`);
  }

  return (
    <div className='flex flex-col items-start justify-center p-6 text-white px-6 md:px-16 lg:px-24 xl:px-32
    bg-[url("/heroImage.jpeg")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className='rounded-full mt-20 bg-green-600 px-3.5 py-1'>Ultimate Hotel Experience</p>
      <h1 className=' text-2xl md:text-5xl md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Discover your perfect destination</h1>
      <p className='max-w-130 mt-2 text-sm md:text-base'>
        Unparalleled luxury and comfort await the world's most exclusive destinations.
      </p>

      {/* Quick City Selection */}
      <div className="mt-4 flex flex-wrap gap-2">
        {cities.map((city) => (
          <button 
            key={city} 
            onClick={() => handleCityClick(city)}
            className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm hover:bg-opacity-30 transition-all"
          >
            {city}
          </button>
        ))}
      </div>

      <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.locationIcon} className='h-4'/>
            <label htmlFor="destinationInput">Destination</label>
          </div>
          <input 
            onChange={e => setDestination(e.target.value)}
            value={destination}
            list='destinations' 
            id="destinationInput" 
            type="text" 
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" 
            placeholder="Type here" 
            required 
          />
          <datalist id='destinations'>
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>
        
        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt='' className='h-4' />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input id="checkIn" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div>
          <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt='' className='h-4' />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input id="checkOut" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
        </div>

        <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
          <label htmlFor="guests">Guests</label>
          <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
        </div>

        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
          <img src={assets.searchIcon} alt='' className='h-7' />
          <span>Search</span>
        </button>
      </form>
    </div>
  )
}

export default Hero