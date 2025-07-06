import React, { useState } from 'react'
import { assets, dashboardDummyData } from '../../assets/assets'
import Title from '../../components/Title'

const Dashboard = () => {
    const [dashboarddata , setDashboardData] = useState(dashboardDummyData)
  return (
    <div className='p-4 ml-4'>
    <Title
      align='left'
      font='outfit'
      title='Dashboard'
      subtitle='Monitor your room listings, track bookings and analyze revenue—all in one place. Stay updated with real-time insights to ensure smooth operations.'
    />

    <div className='flex gap-4 my-8'>
      {/* ---Total Bookings--- */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img
          src={assets.totalBookingIcon}
          alt="Total Bookings Icon"
          className='max-sm:hidden h-10'
        />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg '>Total Bookings</p>
          <p className='text-neutral-400 text-base '>{dashboarddata.totalBookings}</p>
        </div>
      </div>

      {/* Add similar box here for Total Revenue */}
      <div className='bg-primary/3 border border-primary/10 rounded flex p-4 pr-8'>
        <img
          src={assets.totalRevenueIcon}
          alt="Total Bookings Icon"
          className='max-sm:hidden h-10'
        />
        <div className='flex flex-col sm:ml-4 font-medium'>
          <p className='text-blue-500 text-lg '>Total Revenue</p>
          <p className='text-neutral-400 text-base '> $ {dashboarddata.totalRevenue}</p>
        </div>
      </div>
      {/* Example: <div>Total Revenue</div> */}
      
    </div>
    <h2 className='text-xl text-blue-950/70 font-medium mb-5'>Recent Bookings</h2>

<div className='w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll'>
  <table className='w-full'>
    <thead className='bg-gray-50'>
      <tr>
        <th className='py-3 px-4 text-gray-800 font-medium'>User Name</th>
        <th className='py-3 px-4 text-gray-800 font-medium'>Room Name</th>
        <th className='py-3 px-4 text-gray-800 font-medium'>Total Amount</th>
        <th className='py-3 px-4 text-gray-800 font-medium'>Payment Status</th>
      </tr>
    </thead>
    <tbody className='text-sm'>
        {dashboarddata.bookings.map((item , index) => (
            <tr key={index}>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300'>
                    {item.user.username}
                </td>
                <td className='py-3 px-4 text-gray-700 border-t border-gray-300 max-sm:hidden'>
                    {item.room.roomType}
                </td>
                <td className='py-3 px-4 text-center text-gray-700 border-t border-gray-300'>
                     $ {item.totalPrice}
                </td>
                <td className='py-3 px-4 flex border-t border-gray-300'>
                    <button className={`py-1 px-3 text-xs rounded-lg ${item.isPaid ? 'bg-green-200 text-green-700' : 'bg-amber-200 text-yellow-600'}`}>
                        {item.isPaid ? 'Completed' : 'Pending'}
                    </button>
                </td>
            </tr>
        ))}
    </tbody>
  </table>
</div>
  </div>
    
  )
}

export default Dashboard