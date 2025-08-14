import models from '../models/index.js';
import slugify from 'slugify';

const { Category } = models;

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.findAll({ order: [["createdAt", "DESC"]] });

        if (!categories.length) {
            return res.status(404).json({ error: "No categories available." });
        }

        res.status(200).json(categories);
    } catch (error) {
        next(error);
    }
};

export const addCategory = async (req, res, next) => {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: "Category name is required and must be a non-empty string." });
    }

    try {
        const existingCategory = await Category.findOne({ where: { name } });
        if (existingCategory) {
            return res.status(409).json({ error: "Category already exists." });
        }

        const newCategory = await Category.create({ name });

        res.status(201).json({
            message: "Category added successfully",
            category: newCategory
        });

    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    const { slug } = req.params;
    const { name } = req.body;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
        return res.status(400).json({ error: "Category slug is required and must be a non-empty string." });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: "Category name is required and must be a non-empty string." });
    }

    try {
        const category = await Category.findOne({ where: { slug } });

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        category.name = name;
        category.slug = slugify(name, { lower: true, strict: true });
        await category.save();

        res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || !slug.trim()) {
        return res.status(400).json({ error: "Category slug is required and must be a non-empty string." });
    }

    try {
        const category = await Category.findOne({ where: { slug } });

        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }

        await category.destroy();

        res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
        next(error);
    }
};