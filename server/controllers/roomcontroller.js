import Hotel from '../models/Hotel.js';
import Room from '../models/room.js'; 
import { v2 as cloudinary } from 'cloudinary';
export const createroom = async (req, res) => {
    try {
        const { roomType, pricePerNight, amenities } = req.body;
        const hotel = await Hotel.findOne({ owner: req.auth.userId });
        if (!hotel) {
            return res.json({
                success: false,
                message: "No Hotel found"
            });
        }
        const uploadimages = req.files.map(
            async (file) => {
                const response = await cloudinary.uploader.upload(file.path);
                return response.secure_url;
            }
        )
        const images = await Promise.all(uploadimages);
        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: + pricePerNight,
            amenities: JSON.parse(amenities),
            images
        });
        res.json({
            success: true,
            message: "Room created successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}





export const getrooms = async (req, res) => {
    try {
        const rooms = await Room.find({ isAvailable: true }).populate({
            path: 'hotel',
            populate: {
                path: 'owner',
                select: 'image'
            }
        }).sort({ createdAt: -1 });
        res.json({
            success: true,
            rooms
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}



export const getownerrooms = async (req, res) => {
    try {
        const hoteldata = await Hotel.findOne({ owner: req.auth.userId });
        const rooms = await Room.find({ hotel: hoteldata._id.toString() }).populate("hotel");
        res.json({
            success: true,
            rooms
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}



export const toggleavailability = async (req, res) => {
    try {
        const { roomId } = req.body;
        const room = await Room.findById(roomId);
        if (!room) {
            return res.json({
                success: false,
                message: "Room not found"
            });
        }
        room.isAvailable = !room.isAvailable;
        await room.save();
        res.json({
            success: true,
            message: "Room availability toggled successfully"
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
}
 