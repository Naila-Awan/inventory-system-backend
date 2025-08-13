import sequelize from '../config/database.js';
import User from './user.model.js';
import Category from './category.model.js';
import Product from './product.model.js';
import Cart from './cart.model.js';

// User (UUID) <-> Product (createdBy: UUID)
User.hasMany(Product, { foreignKey: 'createdBy', as: 'products' });
Product.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

// Category (INTEGER) <-> Product (categoryId: INTEGER)
Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products'});
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category'});

// Cart (userId: UUID, productId: INTEGER)
Cart.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "productId", onDelete: "CASCADE" });

// Export models
export default { sequelize, User, Category, Product, Cart };
