import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Pizza, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { cartCount } = useCart();
    const { user, isAdmin, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [location]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Menu', path: '/menu' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-4'
                }`}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                    <Pizza className="w-8 h-8" />
                    <span>PizzaSlice</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {!isAdmin && navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="text-dark font-medium hover:text-primary transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {isAdmin && (
                        <Link
                            to="/admin/dashboard"
                            className="text-primary font-medium hover:text-primary-dark transition-colors"
                        >
                            Dashboard
                        </Link>
                    )}
                    {user && !isAdmin && (
                        <Link
                            to="/orders"
                            className="text-dark font-medium hover:text-primary transition-colors"
                        >
                            Orders
                        </Link>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {!isAdmin && (
                        <Link to="/cart">
                            <div className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <ShoppingCart className="w-6 h-6 text-dark" />
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                        </Link>
                    )}

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-dark" />
                                <span className="font-medium text-dark">{user.name}</span>
                            </div>
                            <Button size="sm" variant="outline" onClick={handleLogout}>
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link to="/login">
                                <Button size="sm" variant="ghost">Login</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm">Sign Up</Button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    {!isAdmin && (
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-dark" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 text-dark focus:outline-none"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl z-50 md:hidden flex flex-col p-6"
                    >
                        <div className="flex justify-end mb-8">
                            <button onClick={() => setIsOpen(false)}>
                                <X className="w-6 h-6 text-dark" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-6">
                            {!isAdmin && navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className="text-xl font-medium text-dark hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {isAdmin && (
                                <Link
                                    to="/admin/dashboard"
                                    className="text-xl font-medium text-primary hover:text-primary-dark transition-colors"
                                >
                                    Dashboard
                                </Link>
                            )}
                            {user && !isAdmin && (
                                <Link
                                    to="/orders"
                                    className="text-xl font-medium text-dark hover:text-primary transition-colors"
                                >
                                    Orders
                                </Link>
                            )}

                            <div className="h-px bg-gray-200 my-2"></div>

                            {user ? (
                                <>
                                    <div className="flex items-center gap-2 text-dark">
                                        <User className="w-5 h-5" />
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                    <Button className="w-full" onClick={() => { handleLogout(); setIsOpen(false); }}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="outline" className="w-full">Login</Button>
                                    </Link>
                                    <Link to="/signup" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
