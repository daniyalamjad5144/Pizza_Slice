import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-light to-white pt-20">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <motion.div
                    style={{ y: y1, x: -50 }}
                    className="absolute top-20 left-10 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
                />
                <motion.div
                    style={{ y: y2, x: 50 }}
                    className="absolute top-40 right-10 w-32 h-32 bg-primary rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
                />
                <motion.div
                    style={{ y: y1 }}
                    className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
                />
            </div>

            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <span className="text-primary font-bold tracking-wider uppercase mb-2 block">
                        Best Pizza in Town
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-dark">
                        Slice into <br />
                        <span className="text-primary">Happiness</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        Experience the authentic taste of Italian pizza, baked to perfection with fresh ingredients and a whole lot of passion.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link to="/menu">
                            <Button size="lg" className="shadow-lg shadow-red-500/30">
                                Order Now <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link to="/menu">
                            <Button variant="outline" size="lg">
                                View Menu
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
                    className="relative"
                >
                    <motion.img
                        style={{ y: y2 }}
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
                        alt="Delicious Pizza"
                        className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-full border-4 border-white"
                    />

                    {/* Floating Ingredients (Decorative) */}
                    <motion.div
                        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 right-10 bg-white p-3 rounded-2xl shadow-xl"
                    >
                        <span className="text-2xl">🍅</span>
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-10 -left-5 bg-white p-3 rounded-2xl shadow-xl"
                    >
                        <span className="text-2xl">🧀</span>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
