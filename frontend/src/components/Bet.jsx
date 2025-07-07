import { Link } from 'react-router-dom';
import { useState } from 'react';

function Bet({ bet }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className='w-full lg:w-5/6 aspect-square bg-white rounded-lg shadow-md hover:shadow-lg shadow-gray-500 transition-shadow duration-200 cursor-pointer border border-gray-200'>
            <div
                className='h-full p-4 flex flex-col justify-between'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='flex justify-center'>
                    <p>Image</p>
                </div>
                
                <div className='text-center'>
                    <h3 className='font-bold text-lg text-gray-800 mb-2 line-clamp-2'>
                        <Link
                            to={`/${bet.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className='hover:text-blue-600 transition-colors'
                        >
                            {bet.bet_text}
                        </Link>
                    </h3>
                </div>

                <div className='grid grid-cols-2 justify-center'>
                    {bet.choices.map((choice) => (
                        isOpen && (
                            <div key={choice.id} className='text-center mb-2'>
                                <p className='text-sm text-gray-600 mb-1'>
                                    {choice.choice_text}
                                </p>
                                <span className='inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
                                    {choice.win_condition ?
                                        Math.ceil(bet.win_probability * 100)
                                        : Math.ceil((1 - bet.win_probability) * 100)}%
                                </span>
                            </div>
                        )))}
                </div>

                <div className='text-center mt-2'>
                    <span className='text-xs text-gray-500'>
                        {isOpen ? 'Click to collapse' : 'Click to see probabilities'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Bet;