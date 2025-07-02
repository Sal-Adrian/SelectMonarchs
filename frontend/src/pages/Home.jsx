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
        <div>
            <Navbar />
            <ul>
                {bets.map((bet) => (
                    <Bet key={bet.id} bet={bet} />
                ))}
            </ul>
        </div>
    )
}

export default Home;