import Form from '../components/Form';
import { Link } from 'react-router-dom';

function Register() {
    return (
        <div className='min-h-screen flex flex-col items-center justify-center bg-black'>
            <Form route='/api/user/register/' method='register' />
            <p className='min-h-auto mt-6 text-white font-semibold text-center'>
                Already have an account?{' '}
                <Link to='/login' className='text-green-400 font-extrabold underline hover:text-green-500 transition-colors'>
                    Login
                </Link>
            </p>
        </div>
    )
}

export default Register;