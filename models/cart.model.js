// models/Cart.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const Cart = sequelize.define("Cart", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    validate: {
      notEmpty: { msg: "userId is required" }
    }
  },
  productId: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: {
      isInt: { msg: "productId must be an integer" }
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: "Quantity must be at least 1" }
    }
  },
  priceAtPurchase: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: "Price at purchase must be a decimal value" }
    }
  }
}, {
  tableName: "Cart",
  timestamps: true
});


export default Cart;
