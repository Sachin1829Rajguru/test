import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { useUser, useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast'; 
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
const Appcontext = createContext();
export const AppProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const { user } = useUser();
    const { getToken } = useAuth();
    const [isowner, setisowner] = useState(false);
    const [showhotelregister, setshowhotelregister] = useState(false);
    const [searchedcity, setsearchedcity] = useState([]);
    const [rooms, setrooms] = useState([]);
    const fetchuser = async (req, res) => {
        try {
            const { data } = await axios.get('/api/user/', {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            if (data.success) {
                setisowner(data.role === 'hotelowner');
                setsearchedcity(data.recentsearchedcities);
            }
            else {
                setTimeout(() => {
                    fetchuser();
                }, 5000);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    const fetchrooms = async (req, res) => {
        try {
            const { data } = await axios.get('/api/rooms/');
            if (data.success)
                setrooms(data.rooms);
            else
                toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }
    useEffect(() => {
        if (user) {
            fetchuser();
        }
    }, [user]);
    useEffect(() => {
        fetchrooms();
    }, [])
    const value = {
        currency, navigate, user, getToken, isowner, setisowner, showhotelregister,
        setshowhotelregister, axios, searchedcity, setsearchedcity, rooms, setrooms
    }
    return (
        <Appcontext.Provider value={value}>
            {children}
        </Appcontext.Provider>
    )
}
export const useAppcontext = () => useContext(Appcontext);