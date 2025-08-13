import e from "express";
import { addItemToCart, getCartItems, deleteItemFromCart } from "../controllers/cartController.js";
import authorize from "../middlewares/authorize.js";

const router = e.Router();
/*
 Endpoints: 
○ POST /cart/add — Add product to cart 
○ GET /cart — Retrieve user’s cart with subtotal 
○ DELETE /cart/:productId — Remove a product from cart 
 */

router.post('/add', authorize('viewer', 'admin', 'editor'), addItemToCart);
router.get('/', authorize('viewer', 'admin', 'editor'), getCartItems);
router.delete('/:id', authorize('viewer', 'admin', 'editor'), deleteItemFromCart);

export default router;