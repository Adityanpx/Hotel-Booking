import React, { useState } from 'react';
import { assets, cities } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const HotelRegistration = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(
        `/api/hotels/`,
        { name, contact, address, city },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      console.log("🏨 Hotel Register Response:", data);
      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("❌ Hotel Register Error:", error.response?.data || error.message);
      toast.error(error.message);
    }
  };

  return (
    <div onClick={() => setShowHotelReg(false)} className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className='flex bg-white rounded-xl max-w-4xl max-md:mx-2'>
        <img
          src={assets.regImage}
          alt="reg-image"
          className='w-1/2 rounded-xl hidden md:block'
        />
        <div className='relative flex flex-col items-center md:w-1/2 p-8 md:p-10'>
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
            onClick={() => setShowHotelReg(false)}
          />
          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>
          <div className='w-full mt-4'>
            <label className='font-medium text-gray-500' htmlFor="name">Hotel Name</label>
            <input id='name' onChange={(e) => setName(e.target.value)} type="text" placeholder='Enter Hotel Name'
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>
          <div className='w-full mt-4'>
            <label className='font-medium text-gray-500' htmlFor="contact">Phone</label>
            <input id='contact' onChange={(e) => setContact(e.target.value)} type="number" placeholder='Enter Contact Number'
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>
          <div className='w-full mt-4'>
            <label className='font-medium text-gray-500' htmlFor="address">Address</label>
            <input id='address' onChange={(e) => setAddress(e.target.value)} type="text" placeholder='Enter Hotel Address'
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
          </div>
          <div className='w-full mt-4 max-w-60 mr-auto'>
            <label htmlFor="city" className="font-medium text-gray-500">City</label>
            <select id="city" onChange={(e) => setCity(e.target.value)}
              className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <button className='bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-4'>
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelRegistration;