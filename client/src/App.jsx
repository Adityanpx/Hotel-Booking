import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Allrooms from './pages/Allrooms'
import RoomDetails from './pages/RoomDetails'
import MyBookings from './pages/MyBookings'
import HotelRegistration from './components/HotelRegistration'
import Layout from './pages/hotelOwner/layout'
import Dashboard from './pages/hotelOwner/Dashboard'
import ListRoom from './pages/hotelOwner/ListRoom'
import AddRoom from './pages/hotelOwner/AddRoom'



const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner") 
  return (
    <div>
      { !isOwnerPath && <Navbar/> 
      }
      { false && <HotelRegistration />}
     
      <div className='min-h-[70vh]'>
        <Routes>
          <Route  path='/' element={ <Home />}/>
          <Route  path='/rooms' element={ <Allrooms /> }/>
          <Route path='/rooms/:id' element={<RoomDetails/>}/>
          <Route path='/my-bookings' element={<MyBookings/>}/>
          <Route path='/owner' element={ <Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='add-room' element={<AddRoom />} />
          <Route path='list-room' element={< ListRoom />} />


          
          </Route>


        </Routes>

      </div>
      <Footer/> 
      
    </div>
  )
}

export default App