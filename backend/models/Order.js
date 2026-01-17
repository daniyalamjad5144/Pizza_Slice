import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
        {
            name: { type: String, required: true }, // Changed from productName
            price: { type: Number, required: true },
            quantity: { type: Number, required: true },
            image: { type: String } // Optional but good for UI
        }
    ],
    shippingAddress: {
        address: { type: String },
        city: { type: String },
        postalCode: { type: String },
        country: { type: String }
    },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true }, // Changed from totalAmount
    isDelivered: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
