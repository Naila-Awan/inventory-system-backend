import models from '../models/index.js';

const { Cart, Product } = models;


export const addItemToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;

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
        res.status(500).json({ error: 'Failed to add item to cart.' });
    }
}

export const getCartItems = async (req, res) => {
    try {
        const userId = req.user?.id;
        const cartItems = await Cart.findAll({
            where: { userId },
            include: [{ model: Product }]
        });

        const subtotal = cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.priceAtPurchase) * item.quantity);
        }, 0);

        res.json({ items: cartItems, subtotal });
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve cart.' });
    }
}

export const deleteItemFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        console.log(userId);
        const { id } = req.params;
        const cartItem = await Cart.findOne({ where: { userId, id } });
        if (!cartItem) return res.status(404).json({ error: 'Item not found in cart.' });
        await cartItem.destroy();
        res.json({ message: 'Item removed from cart.' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to remove item from cart.' });
        console.log(err);
    }
}
