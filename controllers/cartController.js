// controllers/cartController.js
import CartItem from '../models/cartItem.js';
import Turf from '../models/turf.js';

class CartController{

  static addToCart = async (req, res) => {
    try {
        const { userId, sportType, date, startTime, duration, court, turf, quantity } = req.body;

        const turfData = await Turf.findById(turf);
        if (!turfData) return res.status(404).json({ message: 'Turf not found' });
        const pricePerHour = turfData.pricePerHour;
        const totalPrice = pricePerHour * duration;

        const existingCartItem = await CartItem.findOne({ userId, sportType, date, startTime, court, turf });

        if (existingCartItem) {
            existingCartItem.quantity += quantity;
            existingCartItem.totalPrice += totalPrice;
            await existingCartItem.save();
            res.status(200).json({ message: 'Item updated in cart', cartItem: existingCartItem });
        } else {
            const newCartItem = new CartItem({
                userId,
                sportType,
                date,
                startTime,
                duration,
                court,
                turf,
                quantity,
                totalPrice
            });
            await newCartItem.save();
            res.status(201).json({ message: 'Item added to cart' , cartItem: newCartItem });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }
  static getAllCartItems = async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static getCartItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const cartItem = await CartItem.findById(id);
        if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
        res.status(200).json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static updateCartItem = async (req, res) => {
    const { id } = req.params;
    const updatedCartItem = req.body;
    try {
        const existingCartItem = await CartItem.findById(id);
        if (!existingCartItem) return res.status(404).json({ message: 'Cart item not found' });
        
        // Calculate total price based on the updated duration
        const turfData = await Turf.findById(existingCartItem.turf);
        const pricePerHour = turfData.pricePerHour;
        updatedCartItem.totalPrice = pricePerHour * updatedCartItem.duration;
        
        const updatedItem = await CartItem.findByIdAndUpdate(id, updatedCartItem, { new: true });
        res.status(200).json({ message: 'Cart item updated',updatedItem});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }

  static deleteCartItem = async (req, res) => {
    const { id } = req.params;
    try {
        const existingCartItem = await CartItem.findById(id);
        if (!existingCartItem) return res.status(404).json({ message: 'Cart item not found' });
        await CartItem.findByIdAndDelete(id);
        res.status(200).json({ message: 'Cart item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  }


}





export default CartController;
