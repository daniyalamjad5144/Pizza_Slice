import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';
import { X, Check } from 'lucide-react';
import { usePizza } from '../../context/PizzaContext';

const PizzaModal = ({ isOpen, onClose, pizza, onAddToCart }) => {
    const [size, setSize] = useState('Medium');
    const [extras, setExtras] = useState([]);
    const { toppings: contextToppings } = usePizza();

    // Use context toppings or fallback (empty)
    const toppingsList = contextToppings && contextToppings.length > 0 ? contextToppings : [];

    // Reset state when pizza changes or modal opens
    useEffect(() => {
        if (isOpen) {
            setSize('Medium');
            setExtras([]);
        }
    }, [isOpen, pizza]);

    if (!isOpen || !pizza) return null;

    const sizes = [
        { name: 'Small', details: '10 inch', multiplier: 0.8 },
        { name: 'Medium', details: '12 inch', multiplier: 1 },
        { name: 'Large', details: '14 inch', multiplier: 1.2 }
    ];

    // Hardcoded list removed in favor of dynamic list above

    // Calculate Total Price
    const basePrice = pizza.prices ? pizza.prices.small : (pizza.price || 0);
    const sizeMultiplier = sizes.find(s => s.name === size)?.multiplier || 1;
    const toppingsPrice = extras.reduce((acc, id) => {
        const topping = toppingsList.find(t => t._id === id); // Use _id for mongoose/mongo objects
        return acc + (topping ? topping.price : 0);
    }, 0);

    const totalPrice = (basePrice * sizeMultiplier) + toppingsPrice;

    const toggleTopping = (id) => {
        setExtras(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        onAddToCart({
            ...pizza,
            selectedSize: size,
            selectedExtras: extras.map(id => toppingsList.find(t => t._id === id)),
            finalPrice: parseFloat(totalPrice.toFixed(2)),
            // Create a unique ID for the cart item based on options to distinguish separate cart items
            cartItemId: `${pizza.id || pizza._id}-${size}-${extras.sort().join('-')}`
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Container */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                        >
                            {/* Header Image */}
                            <div className="relative h-48 sm:h-56">
                                <img
                                    src={pizza.image}
                                    alt={pizza.name}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                    <h2 className="text-2xl font-bold text-white">{pizza.name}</h2>
                                    <p className="text-white/80 line-clamp-1">{pizza.description}</p>
                                </div>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Size Selection */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Size</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {sizes.map((s) => (
                                            <button
                                                key={s.name}
                                                onClick={() => setSize(s.name)}
                                                className={`py-3 px-2 rounded-xl border-2 transition-all text-center ${size === s.name
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-gray-100 hover:border-gray-200 text-gray-600'
                                                    }`}
                                            >
                                                <div className="font-bold">{s.name}</div>
                                                <div className="text-xs opacity-70">{s.details}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Toppings Selection */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Add Extras</h3>
                                    <div className="space-y-2">
                                        {toppingsList.map((topping) => (
                                            <div
                                                key={topping._id}
                                                onClick={() => toggleTopping(topping._id)}
                                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${extras.includes(topping._id)
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-gray-100 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${extras.includes(topping._id) ? 'bg-primary border-primary' : 'border-gray-300'
                                                        }`}>
                                                        {extras.includes(topping._id) && <Check className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className={`font-medium ${extras.includes(topping._id) ? 'text-primary' : 'text-gray-700'}`}>
                                                        {topping.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-500">
                                                    +PKR {topping.price.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50 sticky bottom-0">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-gray-600 font-medium">Total Amount</span>
                                    <span className="text-2xl font-bold text-primary">PKR {totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" onClick={onClose} className="w-full justify-center">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleConfirm} className="w-full justify-center">
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PizzaModal;
