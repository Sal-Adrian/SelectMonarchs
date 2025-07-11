import { useEffect, useState } from 'react';
import api from '../api';
import Bet from '../components/Bet';
import Navbar from '../components/Navbar';

function Home() {
    const [bets, setBets] = useState([]);

    useEffect(() => {
        (async () => {
            await api.get('/bookies/')
                .then((res) => res.data)
                .then((data) => {
                    setBets(data);
                })
                .catch((err) => alert(err));;
        })();
    }, []);

    return (
        <div className='min-h-screen bg-gradient-to-r from-indigo-950 via-neutral-950 to-red-950'>
            <Navbar />
            <div className='container px-4 md:px-6 lg:px-12 py-8'>
                <div className='grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center'>
                    {bets.map((bet) => (
                        <Bet key={bet.id} bet={bet} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home;