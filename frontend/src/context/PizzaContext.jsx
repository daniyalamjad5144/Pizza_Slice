import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const PizzaContext = createContext();

export const usePizza = () => useContext(PizzaContext);

export const PizzaProvider = ({ children }) => {
    const [pizzas, setPizzas] = useState([]);
    const [toppings, setToppings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPizzas = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/pizzas');
            setPizzas(data);

            // Fetch toppings as well
            try {
                const toppingsRes = await api.get('/toppings');
                setToppings(toppingsRes.data);
            } catch (e) {
                console.error("Failed to fetch toppings", e);
            }

            setError(null);
        } catch (err) {
            console.error("Error fetching pizzas:", err);
            setError("Failed to load data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPizzas();
    }, []);

    const addPizza = async (newPizza) => {
        try {
            const { data } = await api.post('/pizzas', newPizza);
            setPizzas(prev => [...prev, data]);
            return { success: true };
        } catch (err) {
            console.error("Error adding pizza:", err);
            return { success: false, message: err.response?.data?.message || "Failed to add pizza" };
        }
    };

    const addTopping = async (newTopping) => {
        try {
            const { data } = await api.post('/toppings', newTopping);
            setToppings(prev => [...prev, data]);
            return { success: true };
        } catch (err) {
            console.error("Error adding topping:", err);
            return { success: false, message: err.response?.data?.message || "Failed to add topping" };
        }
    };

    const value = React.useMemo(() => ({
        pizzas,
        toppings,
        loading,
        error,
        addPizza,
        addTopping,
        refreshPizzas: fetchPizzas
    }), [pizzas, toppings, loading, error]);

    return (
        <PizzaContext.Provider value={value}>
            {children}
        </PizzaContext.Provider>
    );
};
