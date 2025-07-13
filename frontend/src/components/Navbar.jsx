import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api';

function Navbar() {
    const [user, setUser] = useState(null);
    const username = localStorage.getItem("username");
    const navigate = useNavigate();

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

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className='bg-gray-950 border-b border-stone-900 p-4'>
            {user && (
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <span className="text-white text-2xl font-extrabold tracking-wide">
                        Select<span className="text-green-500">Monarchs</span>
                    </span>
                    <div className="flex flex-col md:flex-row items-center mt-2 md:mt-0">
                        <span className="text-white font-semibold mr-0 md:mr-6 mb-2 md:mb-0 bg-stone-900 px-3 py-1 rounded-full border border-green-500">
                            Balance: ${user.balance}
                        </span>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-md transition cursor-pointer" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar;