import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);

    // Load cart when user changes
    useEffect(() => {
        if (user && user.email) {
            const savedCart = localStorage.getItem(`cart_${user.email}`);
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            } else {
                setCart([]);
            }
        } else {
            console.log('Clearing cart because user is null');
            setCart([]); // Clear cart on logout
        }
    }, [user]);

    // Save cart when cart changes (only if user logged in)
    useEffect(() => {
        if (user && user.email) {
            localStorage.setItem(`cart_${user.email}`, JSON.stringify(cart));
        }
    }, [cart, user]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            // Use cartItemId if available (for custom pizzas), otherwise fallback to _id or id
            const itemId = item.cartItemId || item._id || item.id;

            // Check if item already exists
            const existingItem = prevCart.find((cartItem) => (cartItem.cartItemId || cartItem._id || cartItem.id) === itemId);

            if (existingItem) {
                return prevCart.map((cartItem) =>
                    (cartItem.cartItemId || cartItem._id || cartItem.id) === itemId
                        ? { ...cartItem, quantity: cartItem.quantity + 1 }
                        : cartItem
                );
            }

            // For new items, ensure we use the correct price (finalPrice > price) and id
            return [...prevCart, {
                ...item,
                id: itemId,
                price: item.finalPrice || item.price,
                quantity: 1
            }];
        });
    };

    const removeFromCart = (id) => {
        // Match against whatever was stored as 'id' (which is cartItemId for custom items)
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        if (quantity < 1) {
            removeFromCart(id);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};
