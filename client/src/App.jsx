import React from 'react'
import Navbar from './components/Navbar'
import { Routes, useLocation, Route } from 'react-router-dom'
import Home from './pages/Home'
import Footer from './components/Footer'
import Allrooms from './pages/Allrooms'
import Roomdetails from './pages/Roomdetails'
import Mybookings from './pages/Mybookings'
import Hotelreg from './components/Hotelreg'
import Layout from './pages/Hotelowner/Layout'
import Addroom from './pages/Hotelowner/Addroom'
import Dashboard from './pages/Hotelowner/Dashboard'
import Roomlist from './pages/Hotelowner/Roomlist'
import { Toaster } from 'react-hot-toast'
import { useAppcontext } from './context/Appcontext'
import Loader from './components/Loader'
const App = () => {
  const isownerpath = useLocation().pathname.includes("owner");
  const { showhotelregister } = useAppcontext();
  return (
    <div>
      <Toaster></Toaster>
      {!isownerpath && <Navbar />}
      {showhotelregister && <Hotelreg />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Allrooms />} />
          <Route path="/rooms/:id" element={<Roomdetails />} />
          <Route path="/my-bookings" element={<Mybookings />} />
          <Route path="/loader/:nextUrl" element={<Loader />} />
          <Route path="/owner" element={<Layout />} >
            <Route index element={<Dashboard />} />
            <Route path="add-room" element={<Addroom />} />
            <Route path="list-room" element={<Roomlist />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App
