import Form from '../components/Form'
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
            <Form route="/api/token/" method="login" />
            <p className="min-h-auto mt-6 text-white font-semibold text-center">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-400 font-extrabold underline hover:text-green-500 transition-colors">
                    Register
                </Link>
            </p>
        </div>
    )
}

export default Login;