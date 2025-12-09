import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Award, Users, Clock } from 'lucide-react';

const About = () => {
    const stats = [
        { icon: ChefHat, label: "Expert Chefs", value: "25+" },
        { icon: Award, label: "Awards Won", value: "12" },
        { icon: Users, label: "Happy Customers", value: "50k+" },
        { icon: Clock, label: "Years of Service", value: "15" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 min-h-screen bg-light"
        >
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="md:w-1/2">
                        <motion.span
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-primary font-bold uppercase tracking-wider mb-2 block"
                        >
                            Our Story
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-dark mb-6"
                        >
                            Passion for the <br />
                            <span className="text-primary">Perfect Slice</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 text-lg mb-6 leading-relaxed"
                        >
                            At our pizza shop, we believe that a truly great pizza starts with passion. Every pizza we create begins with fresh, hand-crafted dough that’s allowed to rise to perfection, giving it that soft, airy texture with a perfectly crisp edge. Our sauces are prepared from ripe tomatoes, blended with special herbs and spices to create a rich, flavorful base that complements every topping. We use only premium-quality cheese that melts beautifully and delivers that irresistible stretch everyone loves. Each ingredient is carefully selected and prepared daily to ensure a fresh and unforgettable taste in every bite.
                        </motion.p>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-gray-600 text-lg leading-relaxed"
                        >
                            Whether you’re a fan of classic flavors or love exploring bold new combinations, our menu offers something for every pizza lover. From smoky, cheesy delights to spice-packed specials, every pizza is crafted with precision, creativity, and attention to detail. We focus on delivering a perfect balance of taste, texture, and aroma—so every slice feels warm, comforting, and truly satisfying. For us, pizza isn’t just food; it’s an experience meant to be shared with friends, family, and anyone who appreciates quality.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="md:w-1/2 relative"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1542834369-f10ebf06d3e0?auto=format&fit=crop&w=800&q=80"
                            alt="Chef making pizza"
                            className="rounded-3xl shadow-2xl w-full object-cover h-[500px]"
                        />
                        <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
                            <p className="text-4xl font-bold text-primary">100%</p>
                            <p className="text-gray-600 font-medium">Handmade with Love</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-primary rounded-full mb-4">
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-3xl font-bold text-dark mb-2">{stat.value}</h3>
                                <p className="text-gray-500 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-dark mb-4">Why Choose Us?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We don't just make pizza; we create experiences. Here is what sets us apart from the rest.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "Fresh Ingredients", desc: "We use only the freshest, locally sourced ingredients for our toppings." },
                        { title: "Traditional Recipes", desc: "Our recipes have been passed down through generations of Italian chefs." },
                        { title: "Fast Delivery", desc: "Hot and fresh pizza delivered to your doorstep in under 30 minutes." }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ y: -10 }}
                            className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100"
                        >
                            <h3 className="text-xl font-bold text-dark mb-4">{item.title}</h3>
                            <p className="text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default About;
