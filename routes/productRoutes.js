import e from "express";
import authorize from "../middlewares/authorize.js";
import { getAllproducts, getProductById, addProduct, updateProduct, deleteProduct, bulkAddProducts, generateProductsCSV } from "../controllers/productController.js";

const router = e.Router();

router.get('/', authorize('viewer', 'admin', 'editor'), getAllproducts);
router.get('/report/csv', generateProductsCSV);
router.get('/:id', authorize('viewer', 'admin', 'editor'), getProductById);
router.post('/add', authorize('admin', 'editor'), addProduct);
router.post('/bulk-add', authorize('admin', 'editor'), bulkAddProducts);
router.patch('/:id', authorize('admin', 'editor'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;