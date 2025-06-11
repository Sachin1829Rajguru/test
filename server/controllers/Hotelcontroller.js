import Hotel from "../models/Hotel.js";
import User from "../models/user.js";
export const registerhotel = async (req, res) => {
    try { 
        const { name, address, contact, city } = req.body;
        const owner = req.user._id;
        await Hotel.create({
            name,
            address,
            contact,
            owner,
            city
        });
        await User.findByIdAndUpdate(owner, {
            role: "hotelowner"
        });
        res.json({
            success: true,
            message: "Hotel registered successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}