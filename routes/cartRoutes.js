import e from "express";
import { addItemToCart, getCartItems, deleteItemFromCart } from "../controllers/cartController.js";
import { addItemToCartValidator, deleteItemFromCartValidator } from '../validators/cartValidator.js';
import { validationResult } from 'express-validator';
import authorize from "../middlewares/authorize.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = e.Router();
/*
 Endpoints: 
○ POST /cart/add — Add product to cart 
○ GET /cart — Retrieve user’s cart with subtotal 
○ DELETE /cart/:productId — Remove a product from cart 
 */


router.post('/add',
	authorize('viewer', 'admin', 'editor'),
	addItemToCartValidator,
	validateRequest,
	addItemToCart
);

router.get('/', authorize('viewer', 'admin', 'editor'), getCartItems);

router.delete('/:id',
	authorize('viewer', 'admin', 'editor'),
	deleteItemFromCartValidator,
	validateRequest,
	deleteItemFromCart
);

export default router;