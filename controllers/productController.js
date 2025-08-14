import models from '../models/index.js';
import { Op } from 'sequelize';
import { format } from '@fast-csv/format';
const { Product, User, Category } = models;

export const getAllproducts = async (req, res, next) => {
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

        // Validate pagination
        if (isNaN(page) || page < 1) {
            return res.status(400).json({ error: "Page must be a positive number." });
        }
        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({ error: "Limit must be a positive number." });
        }

        const where = {};

        if (category) {
            const catObj = await Category.findOne({
                where: isNaN(category) ? { slug: category } : { id: category }
            });
            if (catObj) {
                where.categoryId = catObj.id;
            } else {
                return res.status(200).json({ products: [], total: 0, page: Number(page), pages: 0 });
            }
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) {
                if (isNaN(minPrice) || minPrice < 0) {
                    return res.status(400).json({ error: "minPrice must be a non-negative number." });
                }
                where.price[Op.gte] = Number(minPrice);
            }
            if (maxPrice) {
                if (isNaN(maxPrice) || maxPrice < 0) {
                    return res.status(400).json({ error: "maxPrice must be a non-negative number." });
                }
                where.price[Op.lte] = Number(maxPrice);
            }
        }

        if (search && typeof search !== 'string') {
            return res.status(400).json({ error: "Search must be a string." });
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

        res.status(200).json({
            products,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit))
        });

    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json({ error: 'Valid product id is required.' });
    }
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
                { model: Category, as: 'category', attributes: ['id', 'name', 'slug'] }
            ]
        });
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

export const addProduct = async (req, res, next) => {
    const {
        title,
        price,
        description,
        categoryId,
        image,
        rating_rate,
        rating_count
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'Product title is required.' });
    }
    if (!price || isNaN(price) || price < 0) {
        return res.status(400).json({ error: 'Valid price is required.' });
    }
    if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({ error: 'Product description is required.' });
    }
    if (!categoryId || isNaN(categoryId)) {
        return res.status(400).json({ error: 'Valid categoryId is required.' });
    }
    if (!image || typeof image !== 'string' || !image.trim()) {
        return res.status(400).json({ error: 'Product image is required.' });
    }

    try {
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
        next(err);
    }
}

export const updateProduct = async (req, res, next) => {
    if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json({ error: 'Valid product id is required.' });
    }
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.update(req.body);
        res.status(200).json(product);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    if (!req.params.id || isNaN(req.params.id)) {
        return res.status(400).json({ error: 'Valid product id is required.' });
    }
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        await product.destroy();
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (err) {
        next(err);
    }
};

export const bulkAddProducts = async (req, res, next) => {
    const { products } = req.body;
    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Products array is required.' });
    }

    const transaction = await models.sequelize.transaction();
    try {
        const createdBy = req.user?.id;
        const insertedProducts = [];

        for (const prod of products) {
            const {
                title,
                price,
                description,
                categoryId,
                image,
                rating_rate,
                rating_count
            } = prod;

            // Validate required fields for each product
            if (!title || typeof title !== 'string' || !title.trim() ||
                !price || isNaN(price) || price < 0 ||
                !description || typeof description !== 'string' || !description.trim() ||
                !categoryId || isNaN(categoryId) ||
                !image || typeof image !== 'string' || !image.trim()) {
                await transaction.rollback();
                return res.status(400).json({ error: 'Invalid product data in array.' });
            }

            const newProduct = await models.Product.create({
                title,
                price,
                description,
                categoryId,
                image,
                rating_rate,
                rating_count,
                createdBy
            }, { transaction });

            insertedProducts.push(newProduct);
        }

        await transaction.commit();
        res.status(201).json({ message: 'Products added successfully', products: insertedProducts });
    } catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const generateProductsCSV = async (req, res, next) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, as: "category", attributes: ["name", "slug"] }
            ],
            attributes: [
                "title",
                "description",
                "price",
                "image",
                "rating_rate",
                "rating_count"
            ]
        });

        res.setHeader("Content-Disposition", "attachment; filename=products.csv");
        res.setHeader("Content-Type", "text/csv");

        const csvStream = format({ headers: true });

        csvStream.pipe(res);

        products.forEach(product => {
            csvStream.write({
                title: product.title,
                description: product.description,
                price: product.price,
                image: product.image,
                rating_rate: product.rating_rate,
                rating_count: product.rating_count,
                category: product.category ? product.category.name : ""
            });
        });

        csvStream.end();

    } catch (err) {
        next(err);
    }
};