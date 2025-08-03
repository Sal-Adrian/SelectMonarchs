import { useState } from 'react';
import api from '../api';   
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function Form({ route, method }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const name = method === 'login' ? 'Login' : 'Register';

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(route, { username, password });
            if (method === 'login') {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                localStorage.setItem('username', username);
                navigate('/');
            } else {
                navigate('/login');
            }
        } catch (error) {
            alert(error);
        }
    }

    const handleGuest = async () => {
        try {
            const res = await api.post('/api/token/', { username: 'guest', password: '123' });
            localStorage.setItem(ACCESS_TOKEN, res.data.access);
            localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
            localStorage.setItem('username', 'guest');
            navigate('/');
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className='flex items-center justify-center bg-black mt-8'>
            <div className='w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl p-8 border-4 border-green-500'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                    <h1 className='text-3xl font-extrabold text-green-500 text-center tracking-wide uppercase font-sans drop-shadow-lg'>{name}</h1>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username'
                        className='px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-lg shadow-inner'
                    />
                    <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password'
                        className='px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 font-bold text-lg shadow-inner'
                    />
                    <button type='submit' className='bg-green-500 hover:bg-green-600 text-black font-extrabold py-3 rounded-lg shadow-lg transition-colors text-lg tracking-wider uppercase cursor-pointer'>
                        {name}
                    </button>
                </form>
                <div className='mt-8 flex flex-col items-center'>
                    <span className='text-white mb-2 font-semibold'>Don't want to make an account?</span>
                    <button
                        onClick={handleGuest}
                        className='bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-black font-extrabold py-2 px-6 rounded-lg shadow-lg transition-all text-base tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer'
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Form;