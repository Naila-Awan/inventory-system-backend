import { body, query, param } from "express-validator";

export const validateAddProduct = [
  body('title').isString().notEmpty().withMessage('Product title is required.'),
  body('price').isFloat({ min: 0 }).withMessage('Valid price is required.'),
  body('description').isString().notEmpty().withMessage('Product description is required.'),
  body('categoryId').isInt().withMessage('Valid categoryId is required.'),
  body('image').isString().notEmpty().withMessage('Product image is required.')
];


export const getAllProductsValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive number."),
  query("limit").optional().isInt({ min: 1 }).withMessage("Limit must be a positive number."),
  query("minPrice").optional().isFloat({ min: 0 }).withMessage("minPrice must be a non-negative number."),
  query("maxPrice").optional().isFloat({ min: 0 }).withMessage("maxPrice must be a non-negative number."),
  query("search").optional().isString().withMessage("Search must be a string."),
  query("sortBy").optional().isIn(["price", "rating", "createdAt"]).withMessage("Invalid sort field."),
  query("order").optional().isIn(["asc", "desc"]).withMessage("Order must be 'asc' or 'desc'.")
];

export const getProductByIdValidator = [
  param("id").isInt().withMessage("Valid product id is required.")
];

export const addProductValidator = [
  body("title").isString().notEmpty().withMessage("Product title is required."),
  body("price").isFloat({ min: 0 }).withMessage("Valid price is required."),
  body("description").isString().notEmpty().withMessage("Product description is required."),
  body("categoryId").isInt().withMessage("Valid categoryId is required."),
  body("image").isString().notEmpty().withMessage("Product image is required."),
  body("rating_rate").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating rate must be between 0 and 5."),
  body("rating_count").optional().isInt({ min: 0 }).withMessage("Rating count must be a non-negative integer.")
];

export const updateProductValidator = [
  param("id").isInt().withMessage("Valid product id is required."),
  body("title").optional().isString().notEmpty().withMessage("Product title must be a non-empty string."),
  body("price").optional().isFloat({ min: 0 }).withMessage("Valid price is required."),
  body("description").optional().isString().notEmpty().withMessage("Product description must be a non-empty string."),
  body("categoryId").optional().isInt().withMessage("Valid categoryId is required."),
  body("image").optional().isString().notEmpty().withMessage("Product image must be a non-empty string."),
  body("rating_rate").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating rate must be between 0 and 5."),
  body("rating_count").optional().isInt({ min: 0 }).withMessage("Rating count must be a non-negative integer.")
];

export const deleteProductValidator = [
  param("id").isInt().withMessage("Valid product id is required.")
];

export const bulkAddProductsValidator = [
  body("products").isArray({ min: 1 }).withMessage("Products array is required."),
  body("products.*.title").isString().notEmpty().withMessage("Product title is required."),
  body("products.*.price").isFloat({ min: 0 }).withMessage("Valid price is required."),
  body("products.*.description").isString().notEmpty().withMessage("Product description is required."),
  body("products.*.categoryId").isInt().withMessage("Valid categoryId is required."),
  body("products.*.image").isString().notEmpty().withMessage("Product image is required."),
  body("products.*.rating_rate").optional().isFloat({ min: 0, max: 5 }).withMessage("Rating rate must be between 0 and 5."),
  body("products.*.rating_count").optional().isInt({ min: 0 }).withMessage("Rating count must be a non-negative integer.")
];
