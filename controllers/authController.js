import models from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { User } = models;

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.scope('withPassword').findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signupUser = async (req, res) => {
  const { name, email, password, provider, googleId, role } = req.body;

  if (!password && provider !== 'google')
    return res.status(400).json({ message: 'Password is required' });
  if (!name || !email)
    return res.status(400).json({ message: 'Name and email are required' });

  try {
    const existingUser = await User.scope('withPassword').findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: 'Email already in use.' });

    const newUser = await User.create({
      name,
      email,
      password,
      provider: provider || 'local',
      googleId: provider === 'google' ? googleId : null,
      role: role || 'viewer'
    });

    const token = jwt.sign(
      { id: newUser.id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'User registered successfully', user: newUser, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const googleCallback = async (req, res) => {
  if (!req.user) return res.status(401).json({ message: 'Google login failed' });

  const token = req.user.token;
  console.log(token);
  res.json({ message: 'Google login successful', user: req.user.user, token });
};
