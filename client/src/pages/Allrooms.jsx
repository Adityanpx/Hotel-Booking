import React, { useMemo, useState, useEffect } from 'react';
import { assets, facilityIcons } from '../assets/assets';
import { useSearchParams } from 'react-router-dom';
import StarRating from '../components/StarRating';
import { useAppContext } from '../context/AppContext';

// Checkbox component for filters
const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input
        type='checkbox'
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

// Radio button component for sorting
const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input
        type='radio'
        name='sortOption'
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

const Allrooms = () => {
  const [searchParams] = useSearchParams();
  const { rooms, navigate, currency } = useAppContext();
  const [openFilters, setOpenfilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    roomType: [],
    priceRange: [],
  });
  const [selectedSort, setSelectedSort] = useState('');
  const [destination, setDestination] = useState('');

  useEffect(() => {
    const dest = searchParams.get('destination');
    setDestination(dest || '');
  }, [searchParams]);

  // Available room types
  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'Family Suite'];

  // Price ranges
  const priceRanges = [
    '0 to 500',
    '500 to 1000',
    '1000 to 2000',
    '2000 to 4000',
    '4000 and more',
  ];

  // Sorting options
  const sortOptions = [
    'Price Low to High',
    'Price High to Low',
    'Newest First',
  ];

  // Handle checkbox filter changes
  const handleFilterChange = (checked, value, type) => {
    setSelectedFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (checked) {
        updatedFilters[type].push(value);
      } else {
        updatedFilters[type] = updatedFilters[type].filter((item) => item !== value);
      }
      return updatedFilters;
    });
  };

  // Handle radio button sort option change
  const handleSortChange = (sortOption) => {
    setSelectedSort(sortOption);
  };

  // Match roomType filters
  const matchesRoomType = (room) => {
    return (
      selectedFilters.roomType.length === 0 ||
      selectedFilters.roomType.includes(room.roomType)
    );
  };

  // Match priceRange filters
  const matchesPriceRange = (room) => {
    if (selectedFilters.priceRange.length === 0) return true;

    return selectedFilters.priceRange.some((range) => {
      if (range === '4000 and more') {
        return room.pricePerNight > 4000;
      }
      const [min, max] = range.split(' to ').map(Number);
      return room.pricePerNight >= min && room.pricePerNight <= max;
    });
  };

  // Filter by search params (destination)
  const filterDestination = (room) => {
    if (!destination) return true;
    return room?.hotel?.city?.toLowerCase().includes(destination.toLowerCase());
  };

  // Sort rooms based on selected sort option
  const sortRooms = (a, b) => {
    if (selectedSort === 'Price Low to High') {
      return a.pricePerNight - b.pricePerNight;
    }
    if (selectedSort === 'Price High to Low') {
      return b.pricePerNight - a.pricePerNight;
    }
    if (selectedSort === 'Newest First') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  };

  // Filtered + sorted rooms (cached with useMemo)
  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room))
      .sort(sortRooms);
  }, [rooms, selectedFilters, selectedSort, destination]);

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({
      roomType: [],
      priceRange: [],
    });
    setSelectedSort('');
    navigate('/rooms');
  };

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 xl:px-32 lg:px-24'>
      {/* Room List Section */}
      <div className='w-full lg:w-3/4'>
        <div>
          <h1 className='text-4xl font-bold md:text-[40px]'>
            {destination ? `Hotels in ${destination}` : 'All Hotels'}
          </h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>
            {filteredRooms.length} {filteredRooms.length === 1 ? 'room' : 'rooms'} found
          </p>
        </div>

        {filteredRooms.length === 0 ? (
          <div className='mt-10 text-center'>
            <p className='text-red-500 text-xl mb-4'>No rooms found matching your criteria</p>
            <button 
              onClick={clearFilters}
              className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Clear all filters
            </button>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div
              key={room._id}
              className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-30 last:border-0'
            >
              <img
                onClick={() => {
                  navigate(`/rooms/${room._id}`);
                  window.scrollTo(0, 0);
                }}
                src={room.images[0]}
                alt='hotel'
                className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer hover:opacity-90 transition-opacity'
              />
              <div className='md:w-1/2 flex flex-col gap-2'>
                <p className='text-gray-500'>{room.hotel?.city}</p>
                <h2
                  onClick={() => {
                    navigate(`/rooms/${room._id}`);
                    window.scrollTo(0, 0);
                  }}
                  className='text-gray-800 text-3xl cursor-pointer hover:text-blue-500'
                >
                  {room.hotel?.name}
                </h2>
                <div className='flex items-center'>
                  <StarRating />
                  <p className='ml-2'>200+ reviews</p>
                </div>
                <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                  <img src={assets.locationFilledIcon} alt='location' className='w-4 h-4' />
                  <span>{room.hotel?.address}</span>
                </div>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                  {room.amenities.map((item, index) => (
                    <div
                      key={index}
                      className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'
                    >
                      <img
                        src={facilityIcons[item]}
                        alt={item}
                        className='w-5 h-5'
                      />
                      <p className='text-xs'>{item}</p>
                    </div>
                  ))}
                </div>
                <div className='flex justify-between items-center'>
                  <p className='text-xl font-medium text-gray-700'>
                    {currency} {room.pricePerNight} <span className='text-sm'>/ night</span>
                  </p>
                  <button 
                    onClick={() => {
                      navigate(`/rooms/${room._id}`);
                      window.scrollTo(0, 0);
                    }}
                    className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filter Sidebar */}
      <div className='bg-white w-full lg:w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:ml-8 lg:sticky lg:top-28'>
        <div className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='flex gap-4 text-xs cursor-pointer'>
            <span onClick={() => setOpenfilters(!openFilters)} className='lg:hidden'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span onClick={clearFilters} className='text-blue-500 hover:text-blue-700'>
              Clear All
            </span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          {/* Room Type Filters */}
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Room Type</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                key={index}
                label={room}
                selected={selectedFilters.roomType.includes(room)}
                onChange={(checked) =>
                  handleFilterChange(checked, room, 'roomType')
                }
              />
            ))}
          </div>

          {/* Price Range Filters */}
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRanges.map((range, index) => (
              <CheckBox
                key={index}
                label={`${currency} ${range}`}
                selected={selectedFilters.priceRange.includes(range)}
                onChange={(checked) =>
                  handleFilterChange(checked, range, 'priceRange')
                }
              />
            ))}
          </div>

          {/* Sort Options */}
          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                key={index}
                label={option}
                selected={selectedSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Allrooms;