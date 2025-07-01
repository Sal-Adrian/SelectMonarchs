import { Link } from 'react-router-dom';

function Bet({ bet }) {
    return (
        <div key={bet.id}>
            <li><Link to={`/${bet.id}`}>{bet.bet_text}</Link></li>
            <ul>
                {bet.choices.map((choice) => (
                    <li key={choice.id}>{choice.choice_text} ==
                    {choice.win_condition ? 
                        Math.ceil(bet.win_probability*100) 
                        : Math.ceil((1-bet.win_probability)*100)}%
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Bet;