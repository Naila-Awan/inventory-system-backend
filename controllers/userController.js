import models from '../models/index.js';

const { User } = models;

export const getUserInfo = async (req, res, next) => {
    try {
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
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { id, newRole } = req.body;
    if (!id || !newRole) {
      return res.status(400).json({ error: "id and newRole are required" });
    }

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
