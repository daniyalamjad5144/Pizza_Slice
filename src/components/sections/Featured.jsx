import React from 'react';
import { motion } from 'framer-motion';
import { pizzas } from '../../data/pizzas';
import Button from '../ui/Button';
import { useCart } from '../../context/CartContext';
import { Star } from 'lucide-react';

const Featured = () => {
    const { addToCart } = useCart();
    const featuredPizzas = pizzas.slice(0, 3);

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold uppercase tracking-wider">Our Best Sellers</span>
                    <h2 className="text-4xl font-bold text-dark mt-2">Popular Pizzas</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredPizzas.map((pizza, index) => (
                        <motion.div
                            key={pizza.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100"
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
        </section>
    );
};

export default Featured;
