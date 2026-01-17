import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight, CreditCard, Banknote, X, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleCheckoutClick = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setShowModal(true);
    };

    const handlePayment = async (method) => {
        setShowModal(false);
        setLoading(true);
        try {
            await api.post('/orders', {
                orderItems: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    pizza: item._id || item.id // Use _id from MongoDB
                })),
                shippingAddress: {
                    address: '123 Fake St', // Placeholder for now or add form
                    city: 'Karachi',
                    postalCode: '75500',
                    country: 'Pakistan'
                },
                paymentMethod: method, // 'Cash' or 'Online'
                itemsPrice: cartTotal,
                taxPrice: 0,
                shippingPrice: 200,
                totalPrice: cartTotal + 200
            });

            // Show success modal instead of alert
            setShowSuccessModal(true);
            clearCart();
            // We navigate when user closes modal or clicks "Go to Orders"
        } catch (error) {
            console.error(error);
            alert('Order failed: ' + (error.response?.data?.message || error.message));
            setLoading(false);
        }
    };

    if (cart.length === 0 && !showSuccessModal) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center bg-light px-4">
                <h2 className="text-3xl font-bold text-dark mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8">Looks like you haven't added any pizzas yet.</p>
                <Link to="/menu">
                    <Button size="lg">Browse Menu</Button>
                </Link>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 min-h-screen bg-light"
        >
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-bold text-dark mb-8">Your Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map((item) => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-xl"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-dark">{item.name}</h3>
                                    {item.selectedSize && (
                                        <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                                    )}
                                    {item.selectedExtras && item.selectedExtras.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            + {item.selectedExtras.map(e => e.name).join(', ')}
                                        </p>
                                    )}
                                    <p className="text-primary font-bold mt-1">PKR {Number(item.price).toFixed(2)}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-dark"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-dark"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </motion.div>
                        ))}

                        <div className="flex justify-end mt-4">
                            <button
                                onClick={clearCart}
                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-lg sticky top-24">
                            <h2 className="text-2xl font-bold text-dark mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>PKR {cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>PKR 200.00</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-dark">
                                    <span>Total</span>
                                    <span>PKR {(cartTotal + 200).toFixed(2)}</span>
                                </div>
                            </div>

                            <Button onClick={handleCheckoutClick} className="w-full py-4 text-lg shadow-xl shadow-red-500/20">
                                Checkout <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
                        >
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <h2 className="text-2xl font-bold text-dark mb-6 text-center">Choose Payment Method</h2>

                            <div className="space-y-4">
                                <button
                                    onClick={() => handlePayment('Online')}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-dark group-hover:text-primary">Pay Online</h3>
                                        <p className="text-sm text-gray-500">Credit/Debit Card, JazzCash, EasyPaisa</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handlePayment('Cash')}
                                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-green-500 hover:bg-green-50 transition-all group"
                                >
                                    <div className="bg-green-100 text-green-600 p-3 rounded-full group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <Banknote className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-bold text-dark group-hover:text-green-600">Cash on Delivery</h3>
                                        <p className="text-sm text-gray-500">Pay when you receive your order</p>
                                    </div>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccessModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl text-center"
                        >
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>

                            <h2 className="text-2xl font-bold text-dark mb-2">Order Successful!</h2>
                            <p className="text-gray-500 mb-8">Your pizza is being prepared and will be with you shortly.</p>

                            <Button
                                onClick={() => navigate('/orders')}
                                className="w-full py-3 text-lg"
                            >
                                Go to My Orders
                            </Button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Cart;
