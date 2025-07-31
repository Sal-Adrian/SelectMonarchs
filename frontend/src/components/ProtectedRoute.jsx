import { Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants'
import { useState, useEffect } from 'react'

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refershToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try {
            const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
            if (response.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, response.data.access);
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExp = decoded.exp;
        const now = Date.now() / 1000;
        if (tokenExp < now) {
            await refershToken();
        } else {
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null) {
        return (
        <div>
            <p>Loading...</p>
            <p>If the website is stuck on this page for more than 5 seconds, then you may need to "wake up" the backend before the frontend can load. <a className="text-blue-500 underline" href="https://sm-backend-g9dp.onrender.com/">Click Here</a>, wait till the page says "Not Found", and then try to open <a className="text-blue-500 underline" href="https://sm-frontend-tfu2.onrender.com">SelectMonarchs</a> again.</p>
        </div>)
    }

    return isAuthorized ? children : <Navigate to="/login" />
}

export default ProtectedRoute;