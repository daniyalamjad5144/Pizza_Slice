import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
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
                                    <p className="text-primary font-bold">${item.price}</p>
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
                                    <span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Fee</span>
                                    <span>$5.00</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-xl font-bold text-dark">
                                    <span>Total</span>
                                    <span>${(cartTotal + 5).toFixed(2)}</span>
                                </div>
                            </div>

                            <Button className="w-full py-4 text-lg shadow-xl shadow-red-500/20">
                                Checkout <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Cart;
