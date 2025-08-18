import models from '../models/index.js';
import slugify from 'slugify';

const { Category } = models;

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.scope('withSlug').findAll({ order: [["createdAt", "DESC"]] });

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