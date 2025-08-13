import e from "express";
import authorize from "../middlewares/authorize.js";
import { getAllproducts, getProductById, addProduct, updateProduct, deleteProduct } from "../controllers/productController.js";

const router = e.Router();

router.get('/', authorize('viewer', 'admin', 'editor'), getAllproducts);
router.get('/:id', authorize('viewer', 'admin', 'editor'), getProductById);
router.post('/add', authorize('admin', 'editor'), addProduct);
router.patch('/:id', authorize('admin', 'editor'), updateProduct);
router.delete('/:id', authorize('admin'), deleteProduct);

export default router;