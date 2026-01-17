import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, User, Calendar, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const MyOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-light">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex flex-col items-center justify-center bg-light px-4">
                <h2 className="text-3xl font-bold text-dark mb-4">No Past Orders</h2>
                <p className="text-gray-600 mb-8">You haven't placed any orders yet.</p>
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
            className="pt-24 pb-20 min-h-screen bg-light"
        >
            <div className="container mx-auto px-4 max-w-4xl">

                {/* User Profile Section */}
                {user && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-primary/10 p-4 rounded-full">
                            <User className="w-10 h-10 text-primary" />
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold text-dark">{user.name}</h2>
                            <div className="flex flex-col md:flex-row gap-4 mt-2 text-gray-500 text-sm">
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{user.email}</span>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 rounded-xl border border-gray-100 text-center">
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <p className="text-2xl font-bold text-primary">{orders.length}</p>
                        </div>
                    </div>
                )}

                <h1 className="text-2xl font-bold text-dark mb-6">Order History</h1>

                <div className="space-y-6">
                    {orders.map((order) => {
                        // Handle schema compatibility (new vs old data)
                        const items = order.orderItems || order.products || [];
                        const total = order.totalPrice || order.totalAmount || 0;
                        const dateObj = order.createdAt ? new Date(order.createdAt) : null;

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-6"
                            >
                                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Order ID: <span className="font-mono">{order._id}</span></p>
                                        <p className="text-sm text-gray-500">
                                            Placed on: {dateObj ? dateObj.toLocaleDateString() : 'N/A'} at {dateObj ? dateObj.toLocaleTimeString() : ''}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {order.isDelivered ? (
                                            <span className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-bold">
                                                <CheckCircle className="w-4 h-4" /> Delivered
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full text-sm font-bold">
                                                <Clock className="w-4 h-4" /> Processing
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 py-4">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center py-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-400">{item.quantity}x</span>
                                                <span className="text-dark font-medium">{item.name || item.productName}</span>
                                            </div>
                                            <span className="text-dark font-bold">PKR {(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <div className="text-sm text-gray-500">
                                        Payment: <span className="font-medium text-dark">{order.paymentMethod || 'Cash'}</span>
                                    </div>
                                    <div className="text-xl font-bold text-primary">
                                        Total: PKR {Number(total).toFixed(2)}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
};

export default MyOrders;
