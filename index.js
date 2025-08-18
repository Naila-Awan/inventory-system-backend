import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { config as configDotenv } from 'dotenv';

import sequelize from './config/database.js';
import { seedAdmin } from './seeders/adminSeeder.js';
import passport from './config/passport.js';

import authenticate from './middlewares/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';

configDotenv();


try {
  await sequelize.authenticate();
  console.log('Database connected.');
  await sequelize.sync();
  await seedAdmin();
} catch (err) {
  console.error('DB connection error:', err);
}


const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

/*
//Temp test route for Google OAuth link
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Link with Google</a>');
});
*/

app.use('/auth', authRoutes);

app.use(authenticate);

app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/cart', cartRoutes);
app.use('/product', productRoutes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

app.use(errorHandler);