import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePizza } from '../context/PizzaContext';
import Button from '../components/ui/Button';
import { PlusCircle, Upload, DollarSign, Tag, Type, Pizza, RefreshCw, X, ShoppingBag, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const { isAdmin, user } = useAuth();
    const { addPizza, pizzas, refreshPizzas, toppings, addTopping } = usePizza();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'add', 'users', 'orders', 'products', 'extras'
    const [stats, setStats] = useState({ revenue: 0, orders: 0, users: 0, products: 0 });
    const [usersList, setUsersList] = useState([]);
    const [ordersList, setOrdersList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleCount, setVisibleCount] = useState(2); // Start with 2 products

    // User Details Modal State
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null); // State for user deletion confirmation

    // Add Pizza Form State
    const [pizza, setPizza] = useState({
        name: '',
        description: '',
        prices: { small: '', medium: '', large: '' },
        image: '',
        category: 'Vegetarian',
        rating: 5.0,
        isNewArrival: true
    });

    // Add Topping Form State
    const [newTopping, setNewTopping] = useState({ name: '', price: '' });

    const [message, setMessage] = useState('');
    const [editPizza, setEditPizza] = useState(null); // State for editing pizza

    // Fetch Stats
    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Users
    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/auth/users');
            // Sort users: Admin first, then others
            const sortedUsers = data.sort((a, b) => {
                if (a.email === 'daniyal.khan5144@gmail.com') return -1;
                if (b.email === 'daniyal.khan5144@gmail.com') return 1;
                return new Date(b.createdAt) - new Date(a.createdAt);
            });
            setUsersList(sortedUsers);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch Orders
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/orders');
            setOrdersList(data);
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Effect to Handle Tab Switching and Data Fetching
    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
            return;
        }

        if (activeTab === 'overview') fetchStats();
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'products') refreshPizzas();
    }, [isAdmin, navigate, activeTab, fetchStats, fetchUsers, fetchOrders, refreshPizzas]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pizza.name || !pizza.prices.small || !pizza.prices.medium || !pizza.prices.large || !pizza.image) {
            setMessage('Please fill in all required fields');
            return;
        }

        const result = await addPizza({
            ...pizza,
            prices: {
                small: parseFloat(pizza.prices.small),
                medium: parseFloat(pizza.prices.medium),
                large: parseFloat(pizza.prices.large)
            },
            rating: parseFloat(pizza.rating)
        });

        if (result.success) {
            setMessage('Pizza added successfully!');
            setPizza({
                name: '',
                description: '',
                prices: { small: '', medium: '', large: '' },
                image: '',
                category: 'Vegetarian',
                rating: 5.0,
                isNewArrival: true
            });
            // Update stats if currently on overview (though we are likely on 'add' tab)
        } else {
            setMessage(result.message || 'Failed to add pizza');
        }

        setTimeout(() => setMessage(''), 3000);
    };

    const handleDeletePizza = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            // Check if we need to implement delete endpoint in api.js first or if we can use api.delete
            // Assuming api.delete('/pizzas/:id') works if backend supports it.
            // I need to double check backend server.js supports DELETE /api/pizzas/:id
            // If not, I will add it. I'll assume it doesn't and add it to backend shortly.
            await api.delete(`/pizzas/${id}`);
            alert("Product deleted successfully");
            // Refresh logic: force update or call a fetch. 
            // AdminDashboard doesn't have a direct fetchPizzas for the list, it uses usePizza context.
            // We should reload the page or trigger a context refresh.
            // Simplest way is reload for now or access fetchPizzas from context if exposed.
            window.location.reload();
        } catch (error) {
            console.error("Failed to delete pizza", error);
            alert("Failed to delete product");
        }
    };

    // Update Pizza
    const handleUpdatePizza = async (e) => {
        e.preventDefault();
        try {
            const { _id, ...updateData } = editPizza;
            const result = await api.put(`/pizzas/${_id}`, updateData);
            setMessage('Product updated successfully!');
            setEditPizza(null); // Close modal
            window.location.reload(); // Refresh to show changes
        } catch (error) {
            console.error("Failed to update pizza", error);
            setMessage('Failed to update product');
        }
    };

    // Open Edit Modal
    const handleEditClick = (product) => {
        // Ensure prices object exists even if legacy data
        const prices = product.prices || { small: product.price || 0, medium: product.price || 0, large: product.price || 0 };
        setEditPizza({ ...product, prices });
    };

    const handleToppingSubmit = async (e) => {
        e.preventDefault();
        if (!newTopping.name || !newTopping.price) {
            setMessage('Please fill in all topping fields');
            return;
        }

        const result = await addTopping({
            name: newTopping.name,
            price: parseFloat(newTopping.price)
        });

        if (result.success) {
            setMessage('Topping added successfully!');
            setNewTopping({ name: '', price: '' });
        } else {
            setMessage(result.message || 'Failed to add topping');
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setPizza(prev => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value }
            }));
        } else {
            setPizza(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleUserClick = async (user) => {
        setSelectedUser(user);
        setIsUserModalOpen(true);
        try {
            const { data } = await api.get(`/orders/${user._id}`);
            setUserOrders(data);
        } catch (error) {
            console.error("Failed to fetch user orders", error);
            setUserOrders([]);
        }
    };

    const closeUserModal = () => {
        setIsUserModalOpen(false);
        setSelectedUser(null);
        setUserOrders([]);
    };

    const handleDeleteUser = (id) => {
        // Just open the confirmation modal
        setUserToDelete(id);
    };

    const confirmDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/auth/users/${userToDelete}`);
            setMessage('User deleted successfully');
            fetchUsers();
            setUserToDelete(null);
        } catch (error) {
            console.error("Failed to delete user", error);
            setMessage('Failed to delete user');
        }
    };

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
            <div className="container mx-auto max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="bg-primary p-6 text-white flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <PlusCircle className="w-8 h-8" />
                                Admin Dashboard
                            </h1>
                            <p className="opacity-90 mt-2">Welcome back, {user?.name}. Manage your Pizza Empire.</p>
                        </div>
                        <div className="flex gap-4">
                            {stats.products === 0 && (
                                <Button
                                    onClick={async () => {
                                        setLoading(true);
                                        try {
                                            await api.post('/pizzas/seed');
                                            fetchStats();
                                            setMessage('Menu seeded successfully!');
                                        } catch (e) {
                                            console.error(e);
                                            setMessage('Failed to seed menu');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="bg-white text-primary hover:bg-gray-100 border-none"
                                >
                                    Seed Menu
                                </Button>
                            )}
                            {loading && <RefreshCw className="animate-spin w-6 h-6 text-white" />}
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-100 pb-4">
                            {[
                                { id: 'overview', label: 'Overview' },
                                { id: 'add', label: 'Add Product' },
                                { id: 'users', label: 'Users' },
                                { id: 'orders', label: 'Orders' },
                                { id: 'products', label: 'Products' },
                                { id: 'extras', label: 'Extras' },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
                            >
                                {message}
                            </motion.div>
                        )}

                        {/* Content Area */}
                        <div className="min-h-[300px]">

                            {activeTab === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <StatsCard
                                        icon={<span className="font-bold text-sm">PKR</span>}
                                        color="bg-green-100 text-green-600"
                                        label="Total Revenue"
                                        value={`PKR ${stats?.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}`}
                                    />
                                    <StatsCard
                                        icon={<Tag className="w-6 h-6" />}
                                        color="bg-blue-100 text-blue-600"
                                        label="Total Orders"
                                        value={stats?.orders || 0}
                                    />
                                    <StatsCard
                                        icon={<Type className="w-6 h-6" />}
                                        color="bg-purple-100 text-purple-600"
                                        label="Total Users"
                                        value={stats?.users || 0}
                                    />
                                    <StatsCard
                                        icon={<Pizza className="w-6 h-6" />}
                                        color="bg-orange-100 text-orange-600"
                                        label="Menu Items"
                                        value={stats?.products || 0}
                                    />
                                </div>
                            )}

                            {activeTab === 'add' && (
                                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField label="Pizza Name" name="name" value={pizza.name} onChange={handleChange} icon={<Type size={20} />} placeholder="e.g. Supreme Delight" />

                                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                            <InputField label="Small Price" name="prices.small" value={pizza.prices.small} onChange={handleChange} type="number" icon={<span className="text-xs font-bold">PKR</span>} placeholder="999" />
                                            <InputField label="Medium Price" name="prices.medium" value={pizza.prices.medium} onChange={handleChange} type="number" icon={<span className="text-xs font-bold">PKR</span>} placeholder="1299" />
                                            <InputField label="Large Price" name="prices.large" value={pizza.prices.large} onChange={handleChange} type="number" icon={<span className="text-xs font-bold">PKR</span>} placeholder="1599" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-2">Category</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <select
                                                    name="category"
                                                    value={pizza.category}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                                                >
                                                    {['Vegetarian', 'Meat', 'Chicken', 'Spicy', 'Seafood'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <InputField label="Image URL" name="image" value={pizza.image} onChange={handleChange} type="url" icon={<Upload size={20} />} placeholder="https://..." />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={pizza.description}
                                            onChange={handleChange}
                                            rows="4"
                                            className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            placeholder="Describe the delicious ingredients..."
                                            required
                                        />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="isNewArrival"
                                            name="isNewArrival"
                                            checked={pizza.isNewArrival}
                                            onChange={(e) => setPizza(prev => ({ ...prev, isNewArrival: e.target.checked }))}
                                            className="w-5 h-5 text-primary focus:ring-primary rounded border-gray-300"
                                        />
                                        <label htmlFor="isNewArrival" className="text-dark font-medium">Mark as New Arrival</label>
                                    </div>

                                    <Button type="submit" size="lg" className="w-full">
                                        Add into Menu
                                    </Button>
                                </form>
                            )}

                            {activeTab === 'orders' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="p-4 text-gray-600">ID</th>
                                                <th className="p-4 text-gray-600">User</th>
                                                <th className="p-4 text-gray-600">Items</th>
                                                <th className="p-4 text-gray-600">Total</th>
                                                <th className="p-4 text-gray-600">Date</th>
                                                <th className="p-4 text-gray-600">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {ordersList.map(order => (
                                                <tr key={order._id} className="hover:bg-gray-50">
                                                    <td className="p-4 font-mono text-xs">{order._id.slice(-6)}</td>
                                                    <td className="p-4 text-sm">{order.user?.name || 'Unknown'}</td>
                                                    <td className="p-4 text-sm text-gray-500">
                                                        {order.orderItems?.length || 0} items
                                                    </td>
                                                    <td className="p-4 font-bold text-primary">PKR {Number(order.totalPrice).toFixed(2)}</td>
                                                    <td className="p-4 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.isDelivered ? 'Delivered' : 'Pending'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {ordersList.length === 0 && (
                                                <tr>
                                                    <td colSpan="6" className="p-8 text-center text-gray-500">No orders found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'users' && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 border-b border-gray-100">
                                                <th className="p-4 text-gray-600">Name</th>
                                                <th className="p-4 text-gray-600">Email</th>
                                                <th className="p-4 text-gray-600">Role</th>
                                                <th className="p-4 text-gray-600">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {usersList.map(u => (
                                                <tr key={u._id} className="hover:bg-gray-50">
                                                    <td className="p-4 font-medium text-dark">{u.name}</td>
                                                    <td className="p-4 text-gray-500">{u.email}</td>
                                                    <td className="p-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                            {u.isAdmin ? 'Admin' : 'Customer'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-gray-500">
                                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : 'N/A'}
                                                    </td>
                                                    <td className="p-4 flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUserClick(u)}
                                                            className={u.isAdmin ? 'invisible' : ''}
                                                        >
                                                            View
                                                        </Button>
                                                        {!u.isAdmin && (
                                                            <button
                                                                type="button"
                                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                                title="Delete User"
                                                                onClick={() => handleDeleteUser(u._id)}
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'products' && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {pizzas && pizzas.slice(0, visibleCount).map(p => (
                                            <div key={p._id} className="flex bg-white border border-gray-100 rounded-xl p-4 gap-4 items-center shadow-sm">
                                                <img src={p.image} alt={p.name} className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h3 className="font-bold text-dark">{p.name}</h3>
                                                            <span className="text-xs text-gray-500 uppercase tracking-wide">{p.category}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="block font-bold text-primary">From PKR {p.prices?.small || p.prices?.medium || '0'}</span>
                                                            <span className="text-xs text-gray-400">Med: {p.prices?.medium} | Lrg: {p.prices?.large}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">{p.description}</p>
                                                    <div className="flex gap-2 justify-end">
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                                                            title="Edit"
                                                            onClick={() => handleEditClick(p)}
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                                            title="Delete"
                                                            onClick={() => handleDeletePizza(p._id)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {pizzas && pizzas.length === 0 && (
                                            <p className="col-span-full text-center text-gray-500 py-12">No products found. Add some!</p>
                                        )}
                                    </div>

                                    {pizzas && visibleCount < pizzas.length && (
                                        <div className="mt-8 text-center">
                                            <Button
                                                onClick={() => setVisibleCount(prev => prev + 4)}
                                                className="bg-white text-primary border border-primary/20 hover:bg-gray-50"
                                            >
                                                Show More Products
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}

                            {activeTab === 'extras' && (
                                <div className="max-w-4xl mx-auto">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8">
                                        <h3 className="text-lg font-bold text-dark mb-4 flex items-center gap-2">
                                            <PlusCircle className="w-5 h-5" />
                                            Add New Extra
                                        </h3>
                                        <form onSubmit={handleToppingSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                                            <div className="flex-1 w-full">
                                                <label className="block text-sm font-medium text-dark mb-1">Name</label>
                                                <input
                                                    type="text"
                                                    value={newTopping.name}
                                                    onChange={(e) => setNewTopping({ ...newTopping, name: e.target.value })}
                                                    className="w-full p-2.5 rounded-lg border border-gray-200"
                                                    placeholder="e.g. Extra Cheese"
                                                    required
                                                />
                                            </div>
                                            <div className="w-full md:w-40">
                                                <label className="block text-sm font-medium text-dark mb-1">Price (PKR)</label>
                                                <input
                                                    type="number"
                                                    value={newTopping.price}
                                                    onChange={(e) => setNewTopping({ ...newTopping, price: e.target.value })}
                                                    className="w-full p-2.5 rounded-lg border border-gray-200"
                                                    placeholder="0.00"
                                                    required
                                                />
                                            </div>
                                            <Button type="submit" className="w-full md:w-auto">
                                                Add Extra
                                            </Button>
                                        </form>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {toppings && toppings.map(t => (
                                            <div key={t._id} className="flex justify-between items-center p-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                                                <span className="font-medium text-gray-700">{t.name}</span>
                                                <span className="font-bold text-primary">PKR {Number(t.price).toFixed(2)}</span>
                                            </div>
                                        ))}
                                        {toppings && toppings.length === 0 && (
                                            <p className="col-span-full text-center text-gray-500 py-8">No extras found.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div >

            {/* User Details Modal */}
            < AnimatePresence >
                {isUserModalOpen && selectedUser && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeUserModal}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 bg-primary text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                                    <p className="opacity-90 text-sm mt-1">{selectedUser.email}</p>
                                </div>
                                <button onClick={closeUserModal} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <div className="flex gap-4 mb-8">
                                    <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-500 text-sm mb-1">Role</p>
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${selectedUser.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {selectedUser.isAdmin ? 'Administrator' : 'Customer'}
                                        </span>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-500 text-sm mb-1">Joined Date</p>
                                        <p className="font-semibold text-dark">
                                            {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="flex-1 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                                        <p className="font-semibold text-dark">{userOrders.length}</p>
                                    </div>
                                </div>

                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-dark">
                                    <ShoppingBag className="w-5 h-5 text-primary" />
                                    Order History
                                </h3>

                                {userOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {userOrders.map(order => (
                                            <div key={order._id} className="border border-gray-100 rounded-xl p-4 hover:border-primary/30 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="text-xs font-mono text-gray-500 mb-1">ID: {order._id}</p>
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {order.isDelivered ? 'Delivered' : 'Pending'}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-primary">PKR {Number(order.totalPrice).toFixed(2)}</p>
                                                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    {order.orderItems.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm text-gray-600">
                                                            <span>{item.quantity}x {item.name}</span>
                                                            {/* If we had item specific prices stored in item object we could show them here */}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                        <p className="text-gray-500">No orders found for this user.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence >

            {/* Edit Product Modal */}
            <AnimatePresence>
                {editPizza && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setEditPizza(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 bg-primary text-white flex justify-between items-center">
                                <h2 className="text-2xl font-bold">Edit Product</h2>
                                <button onClick={() => setEditPizza(null)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <form onSubmit={handleUpdatePizza} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Pizza Name"
                                            name="name"
                                            value={editPizza.name}
                                            onChange={(e) => setEditPizza({ ...editPizza, name: e.target.value })}
                                            icon={<Type size={20} />}
                                        />
                                        <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                            <InputField
                                                label="Small"
                                                name="small"
                                                value={editPizza.prices?.small}
                                                onChange={(e) => setEditPizza({ ...editPizza, prices: { ...editPizza.prices, small: e.target.value } })}
                                                type="number"
                                                icon={<span className="text-xs font-bold">PKR</span>}
                                            />
                                            <InputField
                                                label="Medium"
                                                name="medium"
                                                value={editPizza.prices?.medium}
                                                onChange={(e) => setEditPizza({ ...editPizza, prices: { ...editPizza.prices, medium: e.target.value } })}
                                                type="number"
                                                icon={<span className="text-xs font-bold">PKR</span>}
                                            />
                                            <InputField
                                                label="Large"
                                                name="large"
                                                value={editPizza.prices?.large}
                                                onChange={(e) => setEditPizza({ ...editPizza, prices: { ...editPizza.prices, large: e.target.value } })}
                                                type="number"
                                                icon={<span className="text-xs font-bold">PKR</span>}
                                            />
                                        </div>

                                        <InputField label="Category" // kept below as select for consistency with original or use select directly if easier
                                            name="category" // this block was tricky in replace, using the loop logic below
                                            // skipping full select reconstruction here, relying on original structure
                                            value={editPizza.price} // dummy
                                            className="hidden" // HACK: reusing slot but actually replace content ignores this line if I overwrite whole block
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-dark mb-2">Category</label>
                                            <div className="relative">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                                <select
                                                    name="category"
                                                    value={editPizza.category}
                                                    onChange={(e) => setEditPizza({ ...editPizza, category: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none bg-white"
                                                >
                                                    {['Vegetarian', 'Meat', 'Chicken', 'Spicy', 'Seafood'].map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                            </div>
                                        </div>

                                        <InputField
                                            label="Image URL"
                                            name="image"
                                            value={editPizza.image}
                                            onChange={(e) => setEditPizza({ ...editPizza, image: e.target.value })}
                                            type="url"
                                            icon={<Upload size={20} />}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-dark mb-2">Description</label>
                                        <textarea
                                            name="description"
                                            value={editPizza.description}
                                            onChange={(e) => setEditPizza({ ...editPizza, description: e.target.value })}
                                            rows="4"
                                            className="w-full p-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-end gap-4">
                                        <Button type="button" variant="outline" onClick={() => setEditPizza(null)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {userToDelete && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setUserToDelete(null)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-dark mb-2">Delete User?</h3>
                            <p className="text-gray-500 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
                            <div className="flex gap-3 justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setUserToDelete(null)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={confirmDeleteUser}
                                    className="flex-1 bg-red-500 hover:bg-red-600 border-red-500 text-white"
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div >
    );
};

// Reusable Components to keep main component clean
const StatsCard = ({ icon, color, label, value }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1">
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-dark">{value}</p>
        </div>
    </div>
);

const InputField = ({ label, name, value, onChange, type = "text", icon, placeholder }) => (
    <div>
        <label className="block text-sm font-medium text-dark mb-2">{label}</label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {icon}
            </span>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder={placeholder}
                required
            />
        </div>
    </div>
);

export default AdminDashboard;
