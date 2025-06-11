import express from 'express';
import { registerhotel } from '../controllers/Hotelcontroller.js';
import { protect } from '../middlewares/auth.js';
const hotelrouter = express.Router();
hotelrouter.post('/', protect, registerhotel);
export default hotelrouter;