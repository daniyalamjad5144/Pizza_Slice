import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Lock, Mail, UserCheck, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isAdminLogin, setIsAdminLogin] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleToggle = () => {
        setIsAdminLogin(!isAdminLogin);
        setError('');
        if (!isAdminLogin) {
            setEmail('daniyal.khan5144@gmail.com');
            setPassword(''); // Optional: clear password or pre-fill if desired, leaving empty for security simulation
        } else {
            setEmail('');
            setPassword('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            if (email === 'daniyal.khan5144@gmail.com') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-dark mb-2">
                        {isAdminLogin ? 'Admin Login' : 'Welcome Back'}
                    </h2>
                    <p className="text-gray-500">
                        {isAdminLogin ? 'Access your dashboard' : 'Sign in to continue your pizza journey'}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full py-3 text-lg">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 flex flex-col gap-4 text-center text-gray-500">
                    <button
                        onClick={handleToggle}
                        className="text-sm text-primary font-medium hover:underline focus:outline-none"
                    >
                        {isAdminLogin ? 'Login as User' : 'Login as Admin'}
                    </button>

                    {!isAdminLogin && (
                        <div>
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary font-medium hover:underline">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
