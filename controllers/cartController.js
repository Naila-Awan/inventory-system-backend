import models from '../models/index.js';

const { Cart, Product } = models;


export const addItemToCart = async (req, res, next) => {
    const userId = req.user?.id;
    const { productId, quantity } = req.body;

    if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: 'Valid productId is required.' });
    }
    if (quantity !== undefined && (isNaN(quantity) || quantity < 1)) {
        return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }

    try {
        const product = await Product.findByPk(productId);
        if (!product) return res.status(404).json({ error: 'Product not found.' });

        let cartItem = await Cart.findOne({ where: { userId, productId } });
        if (cartItem) {
            cartItem.quantity += quantity || 1;
            await cartItem.save();
        } else {
            cartItem = await Cart.create({
                userId,
                productId,
                quantity: quantity || 1,
                priceAtPurchase: product.price
            });
        }
        res.status(201).json(cartItem);
    } catch (err) {
        next(err);
    }
}

export const getCartItems = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    try {
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Product }]
        });

        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.priceAtPurchase) * item.quantity);
        }, 0);

        res.status(200).json({ items: cartItems, subtotal });
    } catch (err) {
        next(err);
    }
}

export const deleteItemFromCart = async (req, res, next) => {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId || typeof userId !== 'string') {
        return res.status(401).json({ error: 'Not authenticated.' });
    }
    if (!id || isNaN(id)) {
        return res.status(400).json({ error: 'Valid cart item id is required.' });
    }

    try {
        const cartItem = await Cart.findOne({ where: { userId, id } });
        if (!cartItem) return res.status(404).json({ error: 'Item not found in cart.' });
        await cartItem.destroy();
        res.status(200).json({ message: 'Item removed from cart.' });
    } catch (err) {
        next(err);
    }
}
