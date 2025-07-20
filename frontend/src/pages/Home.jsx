import { useEffect, useState } from 'react';
import api from '../api';
import Bet from '../components/Bet';
import Navbar from '../components/Navbar';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';

function Home() {
    const [bets, setBets] = useState([]);

    useEffect(() => {
        (async () => {
            await api.get('/bookies/')
                .then((res) => res.data)
                .then((data) => {
                    setBets(data);
                })
                .catch((err) => alert(err));
        })();
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900'>
            <Navbar />
            <div className='grid grid-cols-2 bg-gray-950 h-full justify-items-center p-5'>
                <img src={banner1} alt='' className='w-9/10 rounded-t-xl flex items-center justify-center  rounded-2xl' />
                <img src={banner2} alt='' className='w-9/10 rounded-t-xl flex items-center justify-center  rounded-2xl' />
            </div>
            <div className='h-1 bg-gradient-to-l from-gray-900 via-gray-900 to-gray-950'></div>

            <div className='container px-4 md:px-6 lg:px-12 py-8'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center'>
                    {bets.map((bet) => (
                        <Bet key={bet.id} bet={bet} banner={bet.bet_text.toLowerCase().substring(0, bet.bet_text.indexOf(':')).replaceAll(' ', '_')}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home;