import React from 'react'
import icon1 from '../assets/starIconFilled.svg'
import icon2 from '../assets/starIconOutlined.svg'
const Starrating = ({ rating = 4 }) => {
    return (
        <>
            {Array(5).fill('').map((_, index) => (
                <img src={rating > index ? icon1 : icon2} alt="star-icon" className='w-4.5 h-4.5'></img>
            ))}
        </>
    )
}

export default Starrating
