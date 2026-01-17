import React from 'react';
import Hero from '../components/sections/Hero';
import Featured from '../components/sections/Featured';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Hero />
            <Featured />
            {/* Testimonials could go here */}
        </motion.div>
    );
};

export default Home;
