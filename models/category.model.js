import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import slugify from 'slugify';

const Category = sequelize.define('Category', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
            notEmpty: { msg: "Category name cannot be empty" },
            len: { args: [2, 50], msg: "Category name must be between 2 and 50 characters" }
        }
    },
    slug: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
            notEmpty: { msg: "Slug cannot be empty" }
        }
    }
}, {
    defaultScope: { attributes: { exclude: ['slug'] } }, 
    scopes: { withSlug: { attributes: {} } }
});

// Always set slug before validation, both on create and update
Category.beforeValidate((cat) => {
    if (cat.name) {
        cat.slug = slugify(cat.name, { lower: true, strict: true });
    }
});

export default Category;