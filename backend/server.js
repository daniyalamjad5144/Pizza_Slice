import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import Pizza from './models/Pizza.js';
import Topping from './models/Topping.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected to Atlas'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes

// --- AUTH ---

// Login User
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const normalizedEmail = email.toLowerCase();
        console.log('Normalized email:', normalizedEmail);

        // Find user case-insensitively
        const user = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        if (user.password !== password) {
            console.log('Password mismatch');
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isDefaultAdmin = normalizedEmail === 'daniyal.khan5144@gmail.com';
        console.log('Is Default Admin Email?', isDefaultAdmin);
        console.log('Current User Admin Status (DB):', user.isAdmin);

        // Force update logic if it is the default admin but isAdmin is false in DB
        if (isDefaultAdmin && !user.isAdmin) {
            console.log('Forcing Admin Status Update...');
            user.isAdmin = true;
            await user.save();
            console.log('Admin Status Updated.');
        }

        const finalAdminStatus = user.isAdmin || isDefaultAdmin;
        console.log('Final Admin Status to return:', finalAdminStatus);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: finalAdminStatus
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Register User
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email.toLowerCase();

        const existingUser = await User.findOne({ email: { $regex: new RegExp(`^${normalizedEmail}$`, 'i') } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const isAdmin = normalizedEmail === 'daniyal.khan5144@gmail.com';
        const user = new User({
            name,
            email: normalizedEmail, // Save email as lowercase
            password,
            isAdmin
        });
        await user.save();

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get All Users (Admin)
app.get('/api/auth/users', async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        // Debug logging
        if (users.length > 0) {
            console.log('Sample User from DB:', {
                name: users[0].name,
                createdAt: users[0].createdAt,
                type: typeof users[0].createdAt
            });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete User (Admin)
app.delete('/api/auth/users/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// --- PIZZAS ---

// Get All Pizzas
app.get('/api/pizzas', async (req, res) => {
    try {
        const pizzas = await Pizza.find({});
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add Pizza (Admin)
app.post('/api/pizzas', async (req, res) => {
    try {
        const pizza = new Pizza(req.body);
        await pizza.save();
        res.status(201).json(pizza);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete Pizza (Admin)
app.delete('/api/pizzas/:id', async (req, res) => {
    try {
        const deletedPizza = await Pizza.findByIdAndDelete(req.params.id);
        if (!deletedPizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }
        res.json({ message: 'Pizza deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update Pizza (Admin)
app.put('/api/pizzas/:id', async (req, res) => {
    try {
        const updatedPizza = await Pizza.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedPizza) {
            return res.status(404).json({ message: 'Pizza not found' });
        }
        res.json(updatedPizza);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Seed Pizzas (Called by Frontend if empty)
app.post('/api/pizzas/seed', async (req, res) => {
    try {
        // Migration: Reset Pizzas if using old schema (single 'price' field)
        const legacyPizza = await Pizza.findOne({ price: { $exists: true } });
        if (legacyPizza) {
            console.log('Legacy pizzas detected. Clearing collection to update schema...');
            await Pizza.deleteMany({});
        }

        const count = await Pizza.countDocuments();
        if (count > 0) {
            const pizzas = await Pizza.find({});
            return res.json(pizzas);
        }

        const pizzaData = [
            {
                name: "Margherita Supreme",
                description: "Classic tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
                prices: { small: 999, medium: 1299, large: 1599 },
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
                category: "Vegetarian",
                rating: 4.8,
                isNewArrival: true
            },
            {
                name: "Pepperoni Feast",
                description: "Double pepperoni, mozzarella, and our signature tomato sauce.",
                prices: { small: 1199, medium: 1499, large: 1799 },
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
                category: "Meat",
                rating: 4.9,
                isNewArrival: false
            },
            {
                name: "BBQ Chicken",
                description: "Grilled chicken, red onions, cilantro, and tangy BBQ sauce.",
                prices: { small: 1399, medium: 1699, large: 1999 },
                image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
                category: "Chicken",
                rating: 4.7,
                isNewArrival: false
            },
            {
                name: "Veggie Paradise",
                description: "Bell peppers, onions, mushrooms, olives, and spinach.",
                prices: { small: 1099, medium: 1399, large: 1699 },
                image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
                category: "Vegetarian",
                rating: 4.6,
                isNewArrival: false
            },
            {
                name: "Hawaiian Sunset",
                description: "Ham, pineapple, bacon, and extra cheese.",
                prices: { small: 1249, medium: 1549, large: 1849 },
                image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
                category: "Meat",
                rating: 4.5,
                isNewArrival: true
            },
            {
                name: "Spicy Diablo",
                description: "Chorizo, jalapeños, chili flakes, and hot sauce.",
                prices: { small: 1299, medium: 1599, large: 1899 },
                image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
                category: "Spicy",
                rating: 4.8,
                isNewArrival: true
            }
        ];

        const createdPizzas = await Pizza.insertMany(pizzaData);
        res.json(createdPizzas); // Return the created objects so frontend resolves correctly
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// --- TOPPINGS ---

// Get All Toppings
app.get('/api/toppings', async (req, res) => {
    try {
        const toppings = await Topping.find({});
        res.json(toppings);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add Topping (Admin)
app.post('/api/toppings', async (req, res) => {
    try {
        const topping = new Topping(req.body);
        await topping.save();
        res.status(201).json(topping);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// --- ORDERS ---

// Create Order (Checkout)
app.post('/api/orders', async (req, res) => {
    try {
        const { orderItems, totalPrice, shippingAddress, paymentMethod, userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const order = new Order({
            userId,
            orderItems: orderItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            shippingAddress,
            paymentMethod,
            totalPrice
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get All Orders (Admin)
app.get('/api/orders', async (req, res) => {
    try {
        // Auto-update status: Mark orders older than 30 mins as delivered
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await Order.updateMany(
            { isDelivered: false, createdAt: { $lt: thirtyMinutesAgo } },
            { $set: { isDelivered: true } }
        );

        const orders = await Order.find({}).populate('userId', 'name email').sort({ createdAt: -1 });
        const formattedOrders = orders.map(order => ({
            ...order._doc,
            user: order.userId
        }));
        res.json(formattedOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User Orders
app.get('/api/orders/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Auto-update status for this user (good UX when they refresh)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        await Order.updateMany(
            { userId, isDelivered: false, createdAt: { $lt: thirtyMinutesAgo } },
            { $set: { isDelivered: true } }
        );

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Admin Stats (Optimized)
app.get('/api/admin/stats', async (req, res) => {
    try {
        const usersCount = await User.countDocuments();
        const ordersCount = await Order.countDocuments();
        const pizzasCount = await Pizza.countDocuments();

        // Calculate revenue using aggregation for performance
        const revenueResult = await Order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        res.json({
            users: usersCount,
            orders: ordersCount,
            products: pizzasCount,
            revenue: totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Serve Static Assets in Production/Replit
if (process.env.NODE_ENV === 'production' || process.env.REPL_ID) {
    const frontendPath = path.join(__dirname, '../frontend/dist');
    app.use(express.static(frontendPath));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(frontendPath, 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Start Server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);

    // Auto-seed Admin User
    try {
        const adminEmail = 'daniyal.khan5144@gmail.com';
        // Check case-insensitively
        const adminExists = await User.findOne({ email: { $regex: new RegExp(`^${adminEmail}$`, 'i') } });

        if (!adminExists) {
            const adminUser = new User({
                name: 'Daniyal Admin',
                email: adminEmail,
                password: '123daniyal',
                isAdmin: true
            });
            await adminUser.save();
            console.log('Default Admin User Created');
        } else {
            // Ensure admin privileges are set for existing admin
            if (!adminExists.isAdmin) {
                adminExists.isAdmin = true;
                await adminExists.save();
                console.log('Admin privileges restored');
            }

            // ensure password is correct
            if (adminExists.password !== '123daniyal') {
                adminExists.password = '123daniyal';
                await adminExists.save();
                console.log('Admin password restored');
            }

            // Ensure Correct Join Date
            const targetDate = new Date('2025-12-22');
            if (!adminExists.createdAt || new Date(adminExists.createdAt).toDateString() !== targetDate.toDateString()) {
                adminExists.createdAt = targetDate;
                await adminExists.save();
                console.log('Admin Join Date Updated to 22/12/25');
            }
        }

        // Migration: Fix Missing createdAt for legacy users
        // Migration: Fix Missing createdAt for legacy users
        const legacyUsers = await User.updateMany(
            { $or: [{ createdAt: { $exists: false } }, { createdAt: null }] },
            { $set: { createdAt: new Date() } }
        );
        if (legacyUsers.modifiedCount > 0) {
            console.log(`Updated ${legacyUsers.modifiedCount} legacy users with timestamps`);
        }

        // Auto-seed Toppings
        const toppingCount = await Topping.countDocuments();
        if (toppingCount === 0) {
            const toppingsList = [
                { name: 'Extra Cheese', price: 200 },
                { name: 'Pepperoni', price: 250 },
                { name: 'Mushrooms', price: 150 },
                { name: 'Black Olives', price: 150 },
                { name: 'Red Onions', price: 100 },
                { name: 'Jalapeños', price: 150 }
            ];
            await Topping.insertMany(toppingsList);
            console.log('Toppings seeded successfully');
        }

        // Migration: Fix Legacy Pizzas (One-time cleanup for new schema)
        const legacyPizza = await Pizza.findOne({ price: { $exists: true } });
        if (legacyPizza) {
            console.log('Legacy pizzas detected (old schema). Clearing collection to allow re-seeding...');
            await Pizza.deleteMany({});
        }

        // Auto-seed Pizzas (if empty)
        const pizzaCount = await Pizza.countDocuments();
        if (pizzaCount === 0) {
            const pizzaData = [
                {
                    name: "Margherita Supreme",
                    description: "Classic tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.",
                    prices: { small: 999, medium: 1299, large: 1599 },
                    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002",
                    category: "Vegetarian",
                    rating: 4.8,
                    isNewArrival: true
                },
                {
                    name: "Pepperoni Feast",
                    description: "Double pepperoni, mozzarella, and our signature tomato sauce.",
                    prices: { small: 1199, medium: 1499, large: 1799 },
                    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e",
                    category: "Meat",
                    rating: 4.9,
                    isNewArrival: false
                },
                {
                    name: "BBQ Chicken",
                    description: "Grilled chicken, red onions, cilantro, and tangy BBQ sauce.",
                    prices: { small: 1399, medium: 1699, large: 1999 },
                    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
                    category: "Chicken",
                    rating: 4.7,
                    isNewArrival: false
                },
                {
                    name: "Veggie Paradise",
                    description: "Bell peppers, onions, mushrooms, olives, and spinach.",
                    prices: { small: 1099, medium: 1399, large: 1699 },
                    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
                    category: "Vegetarian",
                    rating: 4.6,
                    isNewArrival: false
                },
                {
                    name: "Hawaiian Sunset",
                    description: "Ham, pineapple, bacon, and extra cheese.",
                    prices: { small: 1249, medium: 1549, large: 1849 },
                    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
                    category: "Meat",
                    rating: 4.5,
                    isNewArrival: true
                },
                {
                    name: "Spicy Diablo",
                    description: "Chorizo, jalapeños, chili flakes, and hot sauce.",
                    prices: { small: 1299, medium: 1599, large: 1899 },
                    image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3",
                    category: "Spicy",
                    rating: 4.8,
                    isNewArrival: true
                }
            ];
            await Pizza.insertMany(pizzaData);
            console.log('Menu seeded successfully');
        }

    } catch (e) {
        console.error('Admin seed/migration failed:', e.message);
    }
});

export default app;
