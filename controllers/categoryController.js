import models from '../models/index.js';
import slugify from 'slugify';

const { Category } = models;

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.findAll({ order: [["createdAt", "DESC"]] });

        if (!categories.length) {
            return res.status(404).json({ message: "No categories available." });
        }

        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const addCategory = async (req, res) => {
    const { name } = req.body;

    try {
        if (!name?.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists." });
        }

        const newCategory = await Category.create({ name });

        res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });

    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateCategory = async (req, res) => {
    const { slug } = req.params;
    const { name } = req.body;

    try {
        const category = await Category.findOne({ where: { slug } });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        if (!name?.trim()) {
            return res.status(400).json({ message: "Category name is required" });
        }

        category.name = name;
        category.slug = slugify(name, { lower: true, strict: true }); // Manually update slug
        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCategory = async (req, res) => {
    const { slug } = req.params;

    try {
        const category = await Category.findOne({ where: { slug } });

        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await category.destroy();

        res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ message: "Server error" });
    }
};
