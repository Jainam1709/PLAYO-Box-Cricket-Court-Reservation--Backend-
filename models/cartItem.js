// models/cartItem.js
import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    sportType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    court: {
        type: String,
        required: true
    },
    turf: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Turf'
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    totalPrice: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

export default CartItem;
