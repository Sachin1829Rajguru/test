import express from 'express';
import { protect } from '../middlewares/auth.js';
import { getuserdata, storerecentsearchedcities } from '../controllers/usercontroller.js';

const userrouter = express.Router();
userrouter.get('/', protect, getuserdata);
userrouter.post('/store', protect, storerecentsearchedcities);
export default userrouter;

