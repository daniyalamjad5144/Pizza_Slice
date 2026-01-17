import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-4">PizzaSlice</h3>
                        <p className="text-gray-400 mb-4">
                            Crafting the perfect yummy pizza slices. Fresh ingredients, secret recipes, and a whole lot of love.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Menu</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="w-5 h-5 text-primary shrink-0" />
                                <span>Mehmoodabad No. 1, House No. B-358, Karachi</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <span>03122630510</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <span>hello@pizzaslice.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Opening Hours */}
                    <div>
                        <h4 className="text-lg font-bold mb-4">Opening Hours</h4>
                        <ul className="space-y-2 text-gray-400">
                            <li className="flex justify-between">
                                <span>Mon - Fri</span>
                                <span>11:00 AM - 10:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Saturday</span>
                                <span>11:00 AM - 11:00 PM</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sunday</span>
                                <span>12:00 PM - 10:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} PizzaSlice. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
