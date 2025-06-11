import React, { useEffect, useState } from 'react'
import Hotelcard from './Hotelcard'
import Title from '../components/Title'
import { useAppcontext } from '../context/Appcontext'
function Recommended() {
    const { rooms, searchedcity } = useAppcontext();
    const [recommended, setrecommended] = useState([]);
    const filterhotels = async () => {
        const hotels = rooms.filter((room) => {
            return searchedcity.includes(room.hotel.city);
        })
        setrecommended(hotels);
    }
    useEffect(() => {
        filterhotels();
    }, [rooms, searchedcity])
    return recommended.length > 0 && (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title
                title='Recommended Hotels'
                subTitle='Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences.'
            />
            <div className='flex flex-wrap items-center justify-center gap-6 mt-20'>
                {recommended.slice(0, 2).map((room, index) => (
                    <Hotelcard key={room._id} room={room} index={index} />
                ))}
            </div>

        </div>

    )
}

export default Recommended
