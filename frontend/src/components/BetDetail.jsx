import { useState, useEffect, useRef } from 'react';
import api from '../api';

function BetDetail({ bet }) {
    const [balance, setBalance] = useState(null);
    const [amount, setAmount] = useState('');
    const [choice, setChoice] = useState('');
    const [chance, setChance] = useState(0);
    const [error, setError] = useState('');
    const [winner, setWinner] = useState(null);
    const [winAmount, setWinAmount] = useState(0);
    const [winTotal, setWinTotal] = useState(0);
    const [winsCount, setWinsCount] = useState(0);
    const [lossesCount, setLossesCount] = useState(0);
    const updatingBalance = useRef(false);
    const currentBalance = useRef(0)

    const username = localStorage.getItem("username");

    useEffect(() => {
        (async () => {
            await api.get(`/bookies/profile/${username}/`)
            .then((res) => res.data)
            .then((data) => {
                setBalance(Number(data.balance));
            })
            .catch((err) => alert(err));
        })();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const amt = Number(Number(amount).toFixed(2));

        if (choice === '') setError('choice');
        else if (isNaN(amt)) setError('amount');
        else if (amt > balance || amt <= 0) setError('bet');
        else winLose(amt);
    }
    
    const winLose = (amt) => {
        setError('');
        const rand = Number(Math.random().toFixed(2));
        const win = choice === (rand < Number(bet.win_probability) || rand === Number(bet.win_probability));
        const profit = win ? 
            Number((amt * (1/(chance) - 1)).toFixed(2)) 
            : Number((-amt).toFixed(2));
        
        setWinner(win);
        setWinAmount(profit);
        currentBalance.current = Number((balance + profit).toFixed(2));
        setBalance(currentBalance.current);
        setWinTotal((Number(winTotal) + profit).toFixed(2));
        win ? setWinsCount(winsCount + 1) : setLossesCount(lossesCount + 1);

        if(!updatingBalance.current) {
            updatingBalance.current = true;

            const timeout = setTimeout(() => {
                updatingBalance.current = false;

                api.patch(`/bookies/balance/${username}/`, {balance: currentBalance.current})
                .catch((err) => alert(err));
            }, 1000);
        }
    }
        
    return (
        <div>
            <p>Balance: {balance && `$${balance}`}</p>
            <form onSubmit={handleSubmit}>
                <fieldset>
                <legend><h1>{ bet.bet_text }</h1></legend>
                    <h3>Your Win Probablity: {choice !== '' && Math.ceil(chance*100) + '%'}</h3>
                    {error === 'choice' && <p style={{color: 'red'}}>You must select a choice.</p>}
                    {bet.choices.map((choice) => (
                        <div key={choice.id}>
                            <input 
                                type='radio'  
                                name='choice'
                                value={`${choice.id}`} 
                                onChange={(e) => {
                                    setChoice(choice.win_condition); 
                                    setChance((choice.win_condition ? bet.win_probability : 1-bet.win_probability))}
                                }
                            />
                            {choice.choice_text}
                        </div>
                    ))}
                    <label htmlFor="amount">Bet Amount: $</label>
                    <input 
                        type="text" 
                        value={amount} 
                        onChange={(e) => setAmount(e.target.value)}
                    />
                    {error === 'amount' && <p style={{color: 'red'}}>The amount must be a number.</p>}
                    {error === 'bet' && <p style={{color: 'red'}}>That is an invalid amount.</p>}
                </fieldset>
                <button type='submit'>Place Bet</button>
            </form>

            {winner !== null && 
                <div>
                    <h3>{winner ? 'You won!' : 'You lost!'}</h3>
                    <p>{winner ? 
                    `You won $${winAmount}.` 
                    : `You lost $${-winAmount}.`}</p>

                    <p>{winTotal < 0 ? 
                    `Your total losses: $${-winTotal}`
                    : `Your total winnings: $${winTotal}` }</p>

                    <p>Wins: {winsCount}</p>
                    <p>Losses: {lossesCount}</p>
                </div>
            }
        </div>
    )
}

export default BetDetail;