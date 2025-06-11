import transporter from '../configs/nodemailer.js';
import Booking from '../models/booking.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/room.js';
import stripe from 'stripe'
export const checkavailability = async ({ checkInDate, checkOutDate, room }) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate }
        })
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.log(error.message);
    }
}




export const checkavailabilityapi = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room } = req.body;
        const isAvailable = await checkavailability({ checkInDate, checkOutDate, room });
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


export const createbooking = async (req, res) => {
    try {
        const { checkInDate, checkOutDate, room, guests } = req.body;
        const user = req.user._id;
        const isAvailable = await checkavailability({ checkInDate, checkOutDate, room });
        if (!isAvailable) {
            return res.json({ success: false, message: "Room is not available" });
        }
        const roomdata = await Room.findById(room).populate('hotel');
        let totalPrice = roomdata.pricePerNight;
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        totalPrice *= nights;
        const booking = await Booking.create({
            user,
            room,
            hotel: roomdata.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        })
        console.log("Hi");
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: 'Hotel Booking Details',
            html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${req.user.username},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
                <li><strong>Booking ID:</strong> ${booking._id}</li>
                <li><strong>Hotel Name:</strong> ${roomdata.hotel.name}</li>
                <li><strong>Location:</strong> ${roomdata.hotel.address}</li>
                <li><strong>Date:</strong> ${booking.checkInDate.toDateString()}</li>
                <li><strong>Date:</strong> ${booking.checkOutDate.toDateString()}</li>
                <li><strong>Location:</strong> ${booking.guests}</li>
                <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'} ${booking.totalPrice}</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>`
        }
        await transporter.sendMail(mailoptions)
        res.json({ success: true, message: "Booking created successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




export const getuserbookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await Booking.find({ user }).populate('room hotel').sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}




export const gethotelbookings = async (req, res) => {
    try {
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({ success: false, message: "Hotel not found" });
        }
        const bookings = await Booking.find({ hotel: hotel._id }).populate('user room hotel').sort({ createdAt: -1 });
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        return res.json({
            success: true, dashboard: {
                totalBookings,
                totalRevenue,
                bookings
            }
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }

}









export const stripepayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        const totalPrice = booking.totalPrice;
        const { origin } = req.headers;
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
        const roomData = await Room.findById(booking.room).populate('hotel');
        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: roomData.hotel.name,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            }
        ];
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader/my-bookings`,
            cancel_url: `${origin}/my-bookings`,
            metadata: {
                bookingId,
            }
        });
        res.json({ success: true, url: session.url });
    } catch (error) {
        res.json({ success: false, message: "Payment Failed" });
    }
}