import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/users/${userId}`);
                setUserData(response.data);
            } catch (error) {
                setError('Nie udało się pobrać danych użytkownika.');
            }
        };

        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('userId');
        setTimeout(() => {
            navigate('/login');
        }, 500);
    };

    if (!userData) {
        return <p>Ładowanie...</p>;
    }

    return (
        <div>
            <h2>Witaj, {userData.firstName} {userData.lastName}!</h2>
            <button onClick={handleLogout} className='logOutButton'>Wyloguj</button>
        </div>
    );
};

export default Dashboard;
