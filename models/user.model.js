import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
    id: { 
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    },
    name: {
        type: DataTypes.STRING, 
        allowNull: false 
    },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true, 
        validate: { isEmail: true } 
    },
    password: { 
        type: DataTypes.STRING, 
        allowNull: true 
    },
    provider: { 
        type: DataTypes.ENUM('local', 'google'), 
        defaultValue: 'local' 
    },
    googleId: { 
        type: DataTypes.STRING, 
        allowNull: true },
    role: { 
        type: DataTypes.ENUM('admin', 'editor', 'viewer'), 
        defaultValue: 'viewer' 
    }
}, {
    defaultScope: { attributes: { exclude: ['password'] } },
    scopes: { withPassword: { attributes: {} } }
});

User.beforeCreate(async (user) => {
    if (user.password) user.password = await bcrypt.hash(user.password, 10);
});
User.beforeUpdate(async (user) => {
    if (user.changed('password')) user.password = await bcrypt.hash(user.password, 10);
});

export default User;
