import e from "express";
import { getUserInfo, getAllUsers, updateUserRole } from "../controllers/userController.js";
import authorize from "../middlewares/authorize.js";
import { updateUserRoleValidator } from "../validators/userValidator.js";
import validateRequest from "../middlewares/validateRequest.js";

const router = e.Router();

router.get('/profile', authorize('viewer', 'admin', 'editor'), getUserInfo);
router.get('/allUsers', authorize('admin'), getAllUsers);

router.patch(
    '/updateRole',
    authorize('admin'),
    updateUserRoleValidator,
    validateRequest,
    updateUserRole
);

export default router;
