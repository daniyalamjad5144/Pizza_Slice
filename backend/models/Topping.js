import mongoose from 'mongoose';

const toppingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true }
});

const Topping = mongoose.model('Topping', toppingSchema);
export default Topping;
