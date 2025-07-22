import { Link } from 'react-router-dom';
import { useState } from 'react';

function Bet({ bet, banner }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-full lg:w-5/6 aspect-square bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-200 cursor-pointer'>
            <Link
                to={`/${bet.id}`}
                onClick={(e) => e.stopPropagation()}
                className='h-full flex items-center justify-center text-white text-2xl font-bold group relative'
            >
                <img src={`src/assets/${banner}.jpg`} alt='' className='w-full h-full object-cover rounded-t-xl' />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-200 flex items-center justify-center rounded-t-xl pointer-events-none">
                    <p className="text-white text-3xl font-extrabold">Place Bet</p>
                </div>
            </Link>
            <div className='h-35 sm:px-4 py-5 flex flex-col justify-between relative overflow-hidden' onClick={() => setIsOpen(!isOpen)}>
                <div
                    className={`absolute left-0 top-0 w-full h-full bg-gray-900 z-10 transition-transform duration-300 ease-in-out flex justify-center rounded-b-xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className='grid grid-cols-2 gap-2 w-full px-2 pt-5'>
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
                </div>

                <div className={`text-center transition-opacity duration-200 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
                    <h3 className='font-extrabold text-lg md:text-xl text-white mb-2 line-clamp-3'>{bet.bet_text}</h3>
                </div>

                <div className='text-center mt-2 z-50'>
                    <span className='text-xs text-gray-400'>
                        {isOpen ? 'Click to Collapse' : 'Click to See Probabilities'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Bet;