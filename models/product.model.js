import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Product title cannot be empty" },
            len: { args: [2, 100], msg: "Product title must be between 2 and 100 characters" }
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        validate: {
            isDecimal: { msg: "Price must be a decimal value" },
            min: { args: [0], msg: "Price must be non-negative" }
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Description cannot be empty" }
        }
    },
    categoryId: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: { msg: "CategoryId must be an integer" }
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Image URL cannot be empty" }
        }
    },
    rating_rate: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0,
        validate: {
            min: { args: [0], msg: "Rating must be non-negative" }
        }
    },
    rating_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: { args: [0], msg: "Rating count must be non-negative" }
        }
    },
    createdBy: { 
        type: DataTypes.UUID, 
        allowNull: false,
        validate: {
            notEmpty: { msg: "createdBy is required" }
        }
    }
}, {
    defaultScope: { attributes: { exclude: ['createdBy'] } },
    scopes: { withCreator: { attributes: {} } },
    tableName: 'products',
    timestamps: true
});

export default Product;
