import { Router } from 'express';
import passport from '../config/passport.js';
import { loginUser, signupUser, googleCallback } from '../controllers/authController.js';
import { loginValidator, signupValidator } from '../validators/authValidator.js';
import validateRequest from '../middlewares/validateRequest.js';

const router = Router();


router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/signup', signupValidator, validateRequest, signupUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

export default router;
