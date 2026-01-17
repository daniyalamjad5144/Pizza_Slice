import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    prices: {
        small: { type: Number, required: true },
        medium: { type: Number, required: true },
        large: { type: Number, required: true }
    },
    image: { type: String, required: true },
    category: { type: String, required: true },
    rating: { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false }
});

const Pizza = mongoose.model('Pizza', pizzaSchema);
export default Pizza;
