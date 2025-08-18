import e from "express";
import authorize from "../middlewares/authorize.js";

import { getAllCategories, addCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import { addCategoryValidator, updateCategoryValidator, deleteCategoryValidator } from '../validators/categoryValidator.js';
import validateRequest from "../middlewares/validateRequest.js";


const router = e.Router();
router.get('/', authorize('viewer', 'admin', 'editor'), getAllCategories);

router.post('/add',
	authorize('admin', 'editor'),
	addCategoryValidator,
	validateRequest,
	addCategory
);

router.put('/:slug',
	authorize('admin', 'editor'),
	updateCategoryValidator,
	validateRequest,
	updateCategory
);

router.delete('/:slug',
	authorize('admin'),
	deleteCategoryValidator,
	validateRequest,
	deleteCategory
);

export default router;