import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../../pages/Login';

const AuthWrapper = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('access_token'));
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const storedToken = localStorage.getItem('access_token');
            if (!storedToken) {
                navigate('/login');
                return;
            }
            try {
                const response = await fetch('http://localhost:8000/token/verify', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
            } catch (error) {
                localStorage.removeItem('access_token');
                navigate('/login');
                setToken(null);
            }
        };

        verifyToken();
    }, [navigate, token]);

    if (!token) {
        return <Login setToken={token} />;
    }

    return children;
};

export default AuthWrapper;
