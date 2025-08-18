import { body, param } from 'express-validator';

export const addCategoryValidator = [
	body('name')
		.isString().withMessage('Category name must be a string.')
		.notEmpty().withMessage('Category name is required.')
		.isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters.')
];

export const updateCategoryValidator = [
	param('slug')
		.isString().withMessage('Category slug must be a string.')
		.notEmpty().withMessage('Category slug is required.'),
	body('name')
		.isString().withMessage('Category name must be a string.')
		.notEmpty().withMessage('Category name is required.')
		.isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters.')
];

export const deleteCategoryValidator = [
	param('slug')
		.isString().withMessage('Category slug must be a string.')
		.notEmpty().withMessage('Category slug is required.')
];
