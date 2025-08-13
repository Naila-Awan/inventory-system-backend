import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
    defaultScope: { attributes: { exclude: [] } }, 
    scopes: { withSlug: { attributes: {} } }
});

// Always set slug before validation, both on create and update
Category.beforeValidate((cat) => {
    if (cat.name) {
        cat.slug = slugify(cat.name, { lower: true, strict: true });
    }
});

export default Category;