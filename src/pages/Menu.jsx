import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { pizzas } from '../data/pizzas';
import Button from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { Star } from 'lucide-react';

const Menu = () => {
    const { addToCart } = useCart();
    const [filter, setFilter] = useState('All');
    const categories = ['All', ...new Set(pizzas.map(p => p.category))];

    const filteredPizzas = filter === 'All'
        ? pizzas
        : pizzas.filter(p => p.category === filter);

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

                {/* Filter */}
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

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPizzas.map((pizza) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={pizza.id}
                            className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
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

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-dark">{pizza.name}</h3>
                                    <span className="text-xl font-bold text-primary">${pizza.price}</span>
                                </div>
                                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{pizza.description}</p>
                                <Button
                                    onClick={() => addToCart(pizza)}
                                    className="w-full"
                                >
                                    Add to Cart
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default Menu;
