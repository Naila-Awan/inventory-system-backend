import { Router } from 'express';
import passport from '../config/passport.js';
import { loginUser, signupUser, googleCallback } from '../controllers/authController.js';

const router = Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  googleCallback
);

export default router;
