import e from "express";
import authorize from "../middlewares/authorize.js";
import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";

const router = e.Router();

router.get('/', authorize('viewer', 'admin', 'editor'), getAllCategories);
router.post('/add', authorize('admin', 'editor'), addCategory);
router.put('/:slug', authorize('admin', 'editor'), updateCategory);
router.delete('/:slug', authorize('admin'), deleteCategory);

export default router;