import models from '../models/index.js';
import { Op } from 'sequelize';

const { Product, User, Category } = models;


// Get all products with creator and category info
export const getAllproducts = async (req, res) => {
    try {
        const {
            category,           
            minPrice,
            maxPrice,
            sortBy,            
            order = 'asc',     
            search,            
            page = 1,
            limit = 10
        } = req.query;

        const where = {};

        if (category) {
            const catObj = await Category.findOne({
                where: isNaN(category) ? { slug: category } : { id: category }
            });
            if (catObj) {
                where.categoryId = catObj.id;
            } else {
                return res.json({ products: [], total: 0, page: Number(page), pages: 0 });
            }
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = Number(minPrice);
            if (maxPrice) where.price[Op.lte] = Number(maxPrice);
        }

        if (search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } }
            ];
        }

        let orderArr = [];
        if (sortBy === 'price') {
            orderArr.push(['price', order.toUpperCase()]);
        } else if (sortBy === 'rating') {
            orderArr.push(['rating_rate', order.toUpperCase()]);
        } else {
            orderArr.push(['createdAt', 'DESC']);
        }

        const offset = (Number(page) - 1) * Number(limit);

        const { rows: products, count: total } = await Product.findAndCountAll({
            where,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ],
            order: orderArr,
            offset,
            limit: Number(limit)
        });

        res.json({
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products.' });
    }
};

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
