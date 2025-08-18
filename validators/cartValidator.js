import { body, param } from 'express-validator';

export const addItemToCartValidator = [
	body('productId')
		.notEmpty().withMessage('Product id is required.')
		.isInt().withMessage('Product id must be an integer.'),
	body('quantity')
		.optional()
		.isInt({ min: 1 }).withMessage('Quantity must be a positive number.')
];

export const deleteItemFromCartValidator = [
	param('id')
		.notEmpty().withMessage('Cart item id is required.')
		.isUUID().withMessage('Cart item id must be a valid UUID.')
];
