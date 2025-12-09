import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import Button from '../components/ui/Button';

const Contact = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-24 pb-20 min-h-screen bg-light"
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold uppercase tracking-wider">Get in Touch</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-dark mt-2">Contact Us</h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="bg-white p-8 rounded-3xl shadow-lg h-full">
                            <h2 className="text-2xl font-bold text-dark mb-8">Contact Information</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 text-primary rounded-2xl">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark text-lg mb-1">Our Location</h3>
                                        <p className="text-gray-600">Mehmoodabad No. 1, House No. B-358, Karachi</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 text-primary rounded-2xl">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark text-lg mb-1">Phone Number</h3>
                                        <p className="text-gray-600">03122630510</p>
                                        <p className="text-gray-600">03122630510</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 text-primary rounded-2xl">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark text-lg mb-1">Email Address</h3>
                                        <p className="text-gray-600">hello@pizzaslice.com</p>
                                        <p className="text-gray-600">support@pizzaslice.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-red-50 text-primary rounded-2xl">
                                        <Clock className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-dark text-lg mb-1">Working Hours</h3>
                                        <p className="text-gray-600">Mon - Fri: 11:00 AM - 10:00 PM</p>
                                        <p className="text-gray-600">Sat - Sun: 11:00 AM - 11:00 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="bg-white p-8 rounded-3xl shadow-lg">
                            <h2 className="text-2xl font-bold text-dark mb-8">Send us a Message</h2>
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-colors"
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-colors"
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-colors"
                                        placeholder="Name@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        rows="4"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-primary focus:ring-0 transition-colors resize-none"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <Button className="w-full py-4 shadow-lg shadow-red-500/20">
                                    Send Message <Send className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Contact;
