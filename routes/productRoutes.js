import e from "express";
import authorize from "../middlewares/authorize.js";
import { 
  getAllproducts, 
  getProductById, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  bulkAddProducts, 
  generateProductsCSV 
} from "../controllers/productController.js";

import { 
  getAllProductsValidator, 
  getProductByIdValidator, 
  addProductValidator, 
  updateProductValidator, 
  deleteProductValidator, 
  bulkAddProductsValidator 
} from "../validators/productValidator.js";

import { validationResult } from "express-validator";

const router = e.Router();

// Middleware to handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes with validation + authorization
router.get(
  '/',
  authorize('viewer', 'admin', 'editor'),
  getAllProductsValidator,
  handleValidation,
  getAllproducts
);

router.get(
  '/report/csv',
  authorize('admin', 'editor'),
  generateProductsCSV
);

router.get(
  '/:id',
  authorize('viewer', 'admin', 'editor'),
  getProductByIdValidator,
  handleValidation,
  getProductById
);

router.post(
  '/add',
  authorize('admin', 'editor'),
  addProductValidator,
  handleValidation,
  addProduct
);

router.post(
  '/bulk-add',
  authorize('admin', 'editor'),
  bulkAddProductsValidator,
  handleValidation,
  bulkAddProducts
);

router.patch(
  '/:id',
  authorize('admin', 'editor'),
  updateProductValidator,
  handleValidation,
  updateProduct
);

router.delete(
  '/:id',
  authorize('admin'),
  deleteProductValidator,
  handleValidation,
  deleteProduct
);

export default router;
