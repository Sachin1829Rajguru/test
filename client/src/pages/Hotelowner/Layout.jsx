import React, { useEffect } from 'react'
import Navbar from '../../components/Hotelowner/Navbar'
import Sidebar from '../../components/Hotelowner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppcontext } from '../../context/Appcontext'
const Layout = () => {
    const { isowner, navigate } = useAppcontext();
    useEffect(() => {
        if (!isowner) {
            navigate('/');
        }
    }, [isowner]);
    return (
        <div className='flex flex-col h-screen'>
            <Navbar />
            <div className='flex h-full'>
                <Sidebar />
                <div className='flex-1 p-4 pt-10 md:px-10 h-full'>
                    <Outlet />
                </div>
            </div>

        </div>
    )
}
export default Layout
