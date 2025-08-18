import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { User } = models;

export const loginUser = async (req, res, next) => {

  const { email, password } = req.body;

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', user: user, token });
  } catch (error) {
    next(error);
  }
};

export const signupUser = async (req, res, next) => {
  const { name, email, password, provider, googleId, role } = req.body;
  try {
    const existingUser = await User.scope('withPassword').findOne({ where: { email } });
    if (existingUser)
      return res.status(409).json({ error: 'Email already in use.' });

    const newUser = await User.create({
      name,
      email,
      password,
      provider: provider || 'local',
      googleId: provider === 'google' ? googleId : null,
      role: role || 'viewer'
    });

  res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    next(error);
  }
};

export const googleCallback = async (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Google login failed' });

  const token = req.user.token;
  const frontendUrl = process.env.FRONTEND_URL;
  res.redirect(`${frontendUrl}/products?token=${token}`);
};
