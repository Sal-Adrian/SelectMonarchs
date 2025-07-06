import { Link } from 'react-router-dom';
import { useState } from 'react';

function Bet({ bet }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div key={bet.id}>
            <label>
                <input className='absolute scale-0' type='checkbox' onClick={(e) => { setIsOpen(!isOpen); console.log(isOpen) }} />
                <span className='justify-center'>
                    <div className='flex justify-center border-2 border-blue-500'>
                        <div className='font-bold border-2 border-blue-500'>
                            <Link to={`/${bet.id}`}>{bet.bet_text}</Link>
                        </div>
                    </div>
                    {bet.choices.map((choice) => (
                        <p key={choice.id} className='mb-2 border-2 border-green-500'>
                            {choice.choice_text} ==
                            {choice.win_condition ?
                                Math.ceil(bet.win_probability * 100)
                                : Math.ceil((1 - bet.win_probability) * 100)}%
                        </p>
                    ))}
                </span>
            </label>



        </div>
    )
}

export default Bet;