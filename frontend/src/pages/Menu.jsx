import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePizza } from '../context/PizzaContext';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Star } from 'lucide-react';
import PizzaModal from '../components/ui/PizzaModal';

const Menu = () => {
    // Destructure data from context - it doesn't care if it's from DB or Local!
    const { pizzas, loading, error } = usePizza();
    const { addToCart } = useCart();
    const [filter, setFilter] = useState('All');
    const [selectedPizza, setSelectedPizza] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Get Unique Categories for the Filter Bar
    const categories = useMemo(() => {
        const uniqueCategories = ['All', ...new Set((pizzas || []).map(p => p.category))];
        return uniqueCategories;
    }, [pizzas]);

    // 2. Filter Pizzas based on selection
    const filteredPizzas = useMemo(() => {
        const list = pizzas || [];
        return filter === 'All'
            ? list
            : list.filter(p => p.category === filter);
    }, [pizzas, filter]);

    const handleOpenModal = (pizza) => {
        setSelectedPizza(pizza);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPizza(null), 300); // Clear after animation
    };

    const handleAddToCart = (customizedPizza) => {
        addToCart(customizedPizza);
        handleCloseModal();
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-light">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen pt-24 pb-20 flex items-center justify-center bg-light px-4">
                <div className="text-center text-red-500 bg-red-50 p-6 rounded-xl">
                    <h2 className="text-2xl font-bold mb-2">Oops!</h2>
                    <p>{error}</p>
                </div>
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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">Our Menu</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of delicious pizzas, made with love and the finest ingredients.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setFilter(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${filter === category
                                ? 'bg-primary text-white shadow-lg scale-105'
                                : 'bg-white text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Pizza Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredPizzas.map((pizza) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={pizza.id || pizza._id} // Supports both dummy ID and Mongo _id
                                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Image Section */}
                                <div className="relative h-64 overflow-hidden group">
                                    <img
                                        src={pizza.image}
                                        alt={pizza.name}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-sm">{pizza.rating}</span>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-dark">{pizza.name}</h3>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-primary">
                                                PKR {pizza.prices?.small || pizza.price}
                                                {/* Fallback for safety if prices obj missing */}
                                            </span>
                                        </div>
                                    </div>
                                    {/* Display range if available or simplified view */}
                                    <p className="text-gray-500 text-sm mb-6 line-clamp-2">{pizza.description}</p>
                                    <div className="flex items-center justify-between mt-auto">
                                        <span className="text-sm text-gray-400">From PKR {pizza.prices?.small || '0'}</span>
                                        <Button
                                            onClick={() => handleOpenModal(pizza)}
                                            className="px-6"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            {/* Customization Modal */}
            <PizzaModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                pizza={selectedPizza}
                onAddToCart={handleAddToCart}
            />
        </motion.div>
    );
};

export default Menu;