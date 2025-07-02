import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';

function Navbar() {
    const [user, setUser] = useState(null);
    const username = localStorage.getItem("username");

    useEffect(() => {
        (async () => {
            await api.get(`/bookies/profile/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                setUser(data);
            })
            .catch((err) => alert(err));
        })();
    }, []);

    return (
        <nav>
            <h1>Navbar</h1>
            {user && (
                <>
                    <p>Welcome, {username}</p>
                    <p>Balance: {user.balance}</p>
                </>
            )}
        </nav>
    )
}

export default Navbar;