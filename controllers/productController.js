// productController.js
import models from '../models/index.js';
import { Op } from 'sequelize';
import { format } from '@fast-csv/format';

const { Product, User, Category } = models;

export const getAllproducts = async (req, res, next) => {
  try {

    const { category, minPrice, maxPrice, sortBy, order = 'asc', search, page = 1, limit = 10 } = req.query;

    const where = {};

    if (category) {
      const catObj = await Category.findOne({
        where: isNaN(category) ? { slug: category } : { id: category }
      });
      if (!catObj) {
        return res.status(200).json({ products: [], total: 0, page: Number(page), pages: 0 });
      }
      where.categoryId = catObj.id;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    // Add search filter if search keyword is provided
    if (search && typeof search === 'string' && search.trim()) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    let orderArr = [];
    if (sortBy === 'price') orderArr.push(['price', order.toUpperCase()]);
    else if (sortBy === 'rating') orderArr.push(['rating_rate', order.toUpperCase()]);
    else orderArr.push(['createdAt', 'DESC']);

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
  try {
    const createdBy = req.user?.id;
    const product = await Product.create({ ...req.body, createdBy });

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
};

export const updateProduct = async (req, res, next) => {
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
  const transaction = await models.sequelize.transaction();
  try {
    const createdBy = req.user?.id;
    const insertedProducts = await Promise.all(
      req.body.products.map(prod =>
        Product.create({ ...prod, createdBy }, { transaction })
      )
    );

    await transaction.commit();
    res.status(201).json({ message: 'Products added successfully', products: insertedProducts });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export const generateProductsCSV = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: "category", attributes: ["name", "slug"] }],
      attributes: ["title", "description", "price", "image", "rating_rate", "rating_count"]
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
        category: product.category?.name || ""
      });
    });

    csvStream.end();

  } catch (err) {
    next(err);
  }
};
