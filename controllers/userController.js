import User from "../models/user.model.js";

export const getUserInfo = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const { id, name, email, role, googleId, createdAt, updatedAt } = req.user;

        res.json({
            id,
            name,
            email,
            role,
            googleId,
            createdAt,
            updatedAt
        });

    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if (!users) {
            return res.status(404).json({ message: "No users available" });
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const updateUserRole = async (req, res) => {
    const { id, newRole } = req.body;

    try {
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
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
        console.error("Error updating user role:", error);
        res.status(500).json({ message: "Server error" });
    }
};
