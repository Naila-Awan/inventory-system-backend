import { body } from 'express-validator';

export const loginValidator = [
	body('email')
		.isString().withMessage('Email must be a string.')
		.notEmpty().withMessage('Email is required.')
		.isEmail().withMessage('Must be a valid email.'),
	body('password')
		.isString().withMessage('Password must be a string.')
		.notEmpty().withMessage('Password is required.')
];

export const signupValidator = [
	body('name')
		.isString().withMessage('Name must be a string.')
		.notEmpty().withMessage('Name is required.')
		.isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters.'),
	body('email')
		.isString().withMessage('Email must be a string.')
		.notEmpty().withMessage('Email is required.')
		.isEmail().withMessage('Must be a valid email.'),
	body('password')
		.optional()
		.isString().withMessage('Password must be a string.')
		.isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
	body('provider')
		.optional()
		.isIn(['local', 'google']).withMessage('Provider must be local or google.'),
	body('role')
		.optional()
		.isIn(['admin', 'editor', 'viewer']).withMessage('Role must be admin, editor, or viewer.')
];
