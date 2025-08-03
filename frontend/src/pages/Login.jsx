import Form from '../components/Form';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-black'>
            <Form route='/api/token/' method='login' />
            <p className='min-h-auto mt-6 text-white font-semibold text-center'>
                Don't have an account?{' '}
                <Link to='/register' className='text-green-400 font-extrabold underline hover:text-green-500 transition-colors'>
                    Register
                </Link>
            </p>
            <p className='invisible text-xs my-2 text-black font-semibold text-center '>
            If the login buttons aren't working, then you may need to "wake up" the backend before the frontend can load. <br/>
            Click Here, wait till the page says "Not Found", and then try to open SelectMonarchs again.
            </p>
            <footer className='absolute inset-x-0 bottom-0 text-xs my-2 text-neutral-600 font-semibold text-center'>
            If the login buttons aren't working, then you may need to "wake up" the backend before the frontend can load. <br/>
            <a className="text-gray-400 underline" href="https://sm-backend-g9dp.onrender.com/">Click Here</a>, wait till the page says "Not Found", and then try to open <a className="text-gray-400 underline" href="https://sm-frontend-tfu2.onrender.com">SelectMonarchs</a> again.
            </footer>
        </div>
    )
}

export default Login;
