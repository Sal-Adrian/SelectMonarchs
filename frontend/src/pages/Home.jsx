import { useEffect, useState } from 'react';
import api from '../api';
import Bet from '../components/Bet';

function Home() {
    const [bets, setBets] = useState([]);

    useEffect(() => {
        (async () => {
            await api.get('/bookies/')
            .then((res) => res.data)
            .then((data) => {
                console.log(data);
                setBets(data);
            })
            .catch((err) => alert(err));;
        })();
    }, []);

    return (
        <div>
            <ul>
                {bets.map((bet) => (
                    <Bet key={bet.id} bet={bet} />
                ))}
            </ul>
        </div>
    )
}

export default Home;