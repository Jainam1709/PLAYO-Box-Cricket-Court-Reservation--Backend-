// routes/cartRoutes.js
import express from 'express';
const router = express.Router();
import CartController from '../controllers/cartController.js';


router.post('/add', CartController.addToCart); // Add item to cart
router.get('/viewall', CartController.getAllCartItems); // Get all cart items
router.get('/:id', CartController.getCartItemById); // Get cart item by ID
router.put('/update/:id', CartController.updateCartItem); // Update cart item
router.delete('/delete/:id', CartController.deleteCartItem); // Delete cart item

//PUT route to update the quantity of a court in the cart
// router.put('/:courtId', updateCartItemQuantity);

export default router;
