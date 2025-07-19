import { Link } from 'react-router-dom';
import { useState } from 'react';

function Bet({ bet, banner }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-full lg:w-5/6 aspect-square bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 cursor-pointer'>
            <Link
                to={`/${bet.id}`}
                onClick={(e) => e.stopPropagation()}
                className='h-full flex items-center justify-center text-white text-2xl font-bold mb-4'
            >
                <img src={`src/assets/${banner}.jpg`} alt='' className='w-full h-full object-cover rounded-t-xl' />
            </Link>
            <div className='h-35 sm:px-4 pb-4 flex flex-col justify-between' onClick={() => setIsOpen(!isOpen)}>
                {!isOpen && (
                    <div className='text-center'>
                        <h3 className='font-extrabold text-lg md:text-xl text-white mb-2 line-clamp-3'>
                            <Link
                                to={`/${bet.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className='hover:text-green-400 transition-colors'
                            >
                                {bet.bet_text}
                            </Link>
                        </h3>
                    </div>
                )}

                {isOpen && (
                    <div className='grid grid-cols-2 gap-2 justify-center'>
                        {bet.choices.map((choice) => (
                            <div key={choice.id} className='text-center mb-2'>
                                <p className='text-sm text-gray-300 mb-1 font-medium'>
                                    {choice.choice_text}
                                </p>
                                <span className='inline-block bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md'>
                                    {choice.win_condition ?
                                        Math.round(bet.win_probability * 100)
                                        : Math.round((1 - bet.win_probability) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className='text-center mt-2'>
                    <span className='text-xs text-gray-400'>
                        {isOpen ? 'Click to Collapse' : 'Click to See Probabilities'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Bet;