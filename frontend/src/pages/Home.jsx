import { useEffect, useState } from 'react';
import api from '../api';

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
                    <div key={bet.id}>
                        <li>{bet.bet_text}</li>
                        <ul>
                            {bet.choices.map((choice) => (
                                <li key={choice.id}>{choice.choice_text} == ${choice.amount} == 
                                {choice.win_condition ? 
                                    Math.ceil(bet.win_probability*100) 
                                    : Math.ceil((1-bet.win_probability)*100)}%
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </ul>
        </div>
    )
}

export default Home;