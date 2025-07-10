import { useState, useEffect, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

function BetDetail({ bet }) {
    const navigate = useNavigate();

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
    const [showResult, setShowResult] = useState(false);
    const updatingBalance = useRef(false);
    const currentBalance = useRef(0);

    const username = localStorage.getItem('username');

    useEffect(() => {
        (async () => {
            await api
                .get(`/bookies/profile/${username}/`)
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
    };

    const winLose = (amt) => {
        setError('');
        const rand = Number(Math.random().toFixed(2));
        const win = choice === (rand < Number(bet.win_probability) || rand === Number(bet.win_probability));
        const profit = win ? Number((amt * (1 / chance - 1)).toFixed(2)) : Number((-amt).toFixed(2));

        setWinner(win);
        setWinAmount(profit);
        currentBalance.current = Number((balance + profit).toFixed(2));
        setBalance(currentBalance.current);
        setWinTotal((Number(winTotal) + profit).toFixed(2));
        win ? setWinsCount(winsCount + 1) : setLossesCount(lossesCount + 1);
        setShowResult(false);
        setTimeout(() => setShowResult(true), 50);

        if (!updatingBalance.current) {
            updatingBalance.current = true;

            setTimeout(() => {
                updatingBalance.current = false;

                api.patch(`/bookies/balance/${username}/`, { balance: currentBalance.current }).catch((err) => alert(err));
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
                <div className="h-20 bg-gradient-to-r from-green-700 to-green-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-4">
                    Banner Image Placeholder
                </div>
                
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 font-semibold">Balance:</span>
                    <span className="text-white text-lg font-bold">{balance !== null ? `$${balance}` : '--'}</span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-2 text-center tracking-wide">
                    {bet.bet_text}
                </h1>
                
                <h3 className="text-green-400 text-center mb-2 font-semibold">
                    Your Win Probability: {choice !== '' && Math.ceil(chance * 100) + '%'}
                </h3>

                {/* Betting Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <fieldset className="space-y-2 border-0">
                        {error === 'choice' && (
                            <p className="text-red-400 text-sm font-semibold text-center">You must select a choice.</p>
                        )}
                        <div className="flex flex-col gap-2">
                            {bet.choices.map((c) => (
                                <label
                                    key={c.id}
                                    className="flex justify-center items-center bg-gray-700 rounded px-3 py-2 cursor-pointer hover:bg-green-900 transition"
                                >
                                    <input
                                        type="radio"
                                        name="choice"
                                        value={c.id}
                                        className="accent-green-500 mr-3 scale-125"
                                        onChange={() => {
                                            setChoice(c.win_condition);
                                            setChance(c.win_condition ? bet.win_probability : 1 - bet.win_probability);
                                        }}
                                    />
                                    <span className="text-white font-medium">{c.choice_text}</span>
                                </label>
                            ))}
                        </div>
                        <div className="flex flex-col mt-2">
                            <label htmlFor="amount" className="text-gray-300 mb-1 font-semibold">
                                Bet Amount:
                            </label>
                            <div className="flex items-center">
                                <span className="text-gray-400 mr-1">$</span>
                                <input
                                    id="amount"
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="bg-gray-700 text-white rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
                                    autoComplete="off"
                                />
                            </div>
                            {error === 'amount' && (
                                <p className="text-red-400 text-sm font-semibold mt-1">The amount must be a number.</p>
                            )}
                            {error === 'bet' && (
                                <p className="text-red-400 text-sm font-semibold mt-1">That is an invalid amount.</p>
                            )}
                        </div>
                    </fieldset>
                    <button type="submit"className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition shadow-md mt-2 cursor-pointer">
                        Place Bet
                    </button>
                </form>
                
                {/* Win/Loss Feedback */}
                {winner !== null && showResult && (
                    <div className={`mt-4 flex flex-col items-center animate-fade-in-fast ${winner ? 'animate-bounce' : 'animate-shake'}`}>
                        <span className={`px-6 py-2 rounded-full text-white font-bold text-lg shadow-lg mb-2 transition-all duration-300 ${winner ? 'bg-green-600' : 'bg-red-600'}`}>
                            {winner ? 'You Won!' : 'You Lost!'}
                        </span>
                        <p className="text-white text-lg font-semibold">
                            {winner ? `You won $${winAmount}` : `You lost $${-winAmount}`}
                        </p>
                    </div>
                )}
                
                {/* Stats */}
                <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-white text-sm md:text-base">
                    <span>
                        Wins: <span className="font-bold text-green-400">{winsCount}</span>
                    </span>
                    <span>
                        Losses: <span className="font-bold text-red-400">{lossesCount}</span>
                    </span>
                    <span>
                        {winTotal < 0 ? (
                            <span className="text-red-400">Total Losses: ${-winTotal}</span>
                        ) : (
                            <span className="text-green-400">Total Winnings: ${winTotal}</span>
                        )}
                    </span>
                </div>

                {/* Go to Home Page */}
                <div className="flex justify-center">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition shadow-md mt-2 cursor-pointer" onClick={() => navigate('/')}>
                        Go to Home Page
                    </button>
                </div>
            </div>

            <style>{`
        @keyframes fade-in-fast { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in-fast { animation: fade-in-fast 0.3s ease; }
        @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-8px); } 40%, 60% { transform: translateX(8px); } }
        .animate-shake { animation: shake 0.5s; }
      `}</style>
        </div>
    );
}

export default BetDetail;