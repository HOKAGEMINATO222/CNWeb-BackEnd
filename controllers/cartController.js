const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const addProductToCart = async (req, res) => {
    const { productId, variantColor, quantity } = req.body;
    const userId = req.userId; // Get userId from middleware

    console.log(req.body);

    try {

        // Find the user's cart
        let cart = await CartModel.findOne({ userId });
        if (!cart) {
            // Create a new cart if it doesn't exist
            cart = new CartModel({ userId, items: [] });
        }

        // Check if the product with variant already exists in the cart
        const existingItemIndex = cart.items.findIndex(
            item =>
                item.productId.toString() === productId && // Check productId match
                item.variant.color.toString() === variantColor // Check if any variant matches
        );

        //console.log(item.productId, item.variant.color);
        

        if (existingItemIndex !== -1) {
            // Update the quantity of the existing product
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Fetch product and variant details
            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            const variant = product.variants.find(v => v.color.toString() === variantColor);
            if (!variant) {
                return res.status(404).json({ message: "Variant not found" });
            }

            // Add new product with variant to the cart
            cart.items.push({
                productId,
                variant,
                quantity,
            });
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json({ message: "Product added to cart", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding product to cart", error: error.message });
    }
};


// Update Product Quantity (protected)
const updateProductQuantity = async (req, res) => {
    const { productId, variantColor, quantity } = req.body;
    const userId = req.userId; // Get userId from middleware

    console.log(productId, variantColor, quantity);

    try {
        // Find the user's cart
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            item =>
                item.productId.toString() === productId && // Check productId match
                item.variant.color.toString() === variantColor // Check if any variant matches
        );

        console.log(itemIndex);

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Product not found in cart" });
        }

        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        // Save the updated cart
        await cart.save();
        res.status(200).json({ message: "Product quantity updated", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating product quantity", error: error.message });
    }
};

// Delete Product from Cart (protected)
const deleteProductFromCart = async (req, res) => {
    const { productId, variantColor } = req.body;
    const userId = req.userId; // Get userId from middleware

    try {
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(
            item =>
                item.productId.toString() === productId && // Check productId match
                item.variant.color.toString() === variantColor // Check if any variant matches
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        // Remove the product from the cart
        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};

// Get Cart (protected)
const getCart = async (req, res) => {
    try {
        const userId = req.userId; // Access userId from middleware
        const cart = await CartModel.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ message: "Cart fetched successfully", cart });
    } catch (error) {
        res.status(500).json({ message: "Error fetching cart", error: error.message });
    }
};

module.exports = {
    addProductToCart,
    updateProductQuantity,
    deleteProductFromCart,
    getCart
};
