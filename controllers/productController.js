import models from '../models/index.js';

const { Product, User, Category } = models;


// Get all products with creator and category info
export const getAllproducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

// Get product by ID with creator and category info
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch product.' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const {
            title,
            price,
            description,
            categoryId,
            image,
            rating_rate,
            rating_count
        } = req.body;

        const createdBy = req.user?.id;

        const product = await Product.create({
            title,
            price,
            description,
            categoryId,
            image,
            rating_rate,
            rating_count,
            createdBy
        });

        // Fetch with associations for response
        const newProduct = await Product.findByPk(product.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });

        res.status(201).json(newProduct);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to add product.' });
    }
}

// Update product by ID
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.update(req.body);
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update product.' });
    }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.destroy();
        res.json({ message: 'Product deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete product.' });
    }
}
