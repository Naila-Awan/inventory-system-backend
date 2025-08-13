import e from "express";
import { getUserInfo, getAllUsers, updateUserRole } from "../controllers/userController.js";
import authorize from "../middlewares/authorize.js";

const router = e.Router();

router.get('/profile', authorize('viewer', 'admin', 'editor'), getUserInfo);
router.get('/allUsers', authorize('admin'), getAllUsers);

router.patch('/updateRole', authorize('admin'), updateUserRole);

export default router;