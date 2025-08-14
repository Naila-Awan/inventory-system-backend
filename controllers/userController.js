import models from '../models/index.js';

const { User } = models;


export const getUserInfo = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Not authenticated" });
        }
        const { id, name, email, role, googleId, createdAt, updatedAt } = req.user;

        res.status(200).json({
            id,
            name,
            email,
            role,
            googleId,
            createdAt,
            updatedAt
        });

    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users available" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        next(error);
    }
}

export const updateUserRole = async (req, res, next) => {
    const { id, newRole } = req.body;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: "User id is required and must be a string." });
    }
    if (!newRole || typeof newRole !== 'string') {
        return res.status(400).json({ error: "New role is required and must be a string." });
    }

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({
            message: "User role updated successfully",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (error) {
        next(error);
    }
};
