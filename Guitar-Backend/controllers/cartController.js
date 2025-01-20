
const Cart = require("../models/cartModel");

// Utility functions
const validateCartItemInput = (productId, quantity, total) => {
  if (!productId || !quantity || !total) {
    throw new Error("Please enter all fields");
  }
};

const calculateTotal = (quantity, pricePerItem) => quantity * pricePerItem;

// Controllers
const CartController = {
  async addToCart(req, res) {
    const { productId, quantity, total } = req.body;
    const userId = req.user.id;

    try {
      validateCartItemInput(productId, quantity, total);

      const itemInCart = await Cart.findOne({
        productId,
        userId,
        status: "active",
      });

      if (itemInCart) {
        itemInCart.quantity += parseInt(quantity, 10);
        itemInCart.total = calculateTotal(
          itemInCart.quantity,
          total / quantity
        );
        await itemInCart.save();
        return res.status(200).json({
          message: "Item quantity updated",
          cartItem: itemInCart,
        });
      }

      const newCartItem = new Cart({
        productId,
        quantity: parseInt(quantity, 10),
        total,
        userId,
      });

      await newCartItem.save();
      res
        .status(200)
        .json({ message: "Item added to cart", cartItem: newCartItem });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async getAllCartItems(req, res) {
    const userId = req.user.id;

    try {
      const cartItems = await Cart.find({
        userId,
        status: "active",
      }).populate("productId");

      res.status(200).json({
        carts: cartItems,
        message: "Cart items fetched successfully",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteCartItem(req, res) {
    const { id } = req.params;

    try {
      await Cart.findByIdAndDelete(id);
      res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateCartItem(req, res) {
    const { id } = req.params;
    let { quantity, total } = req.body;

    try {
      quantity = parseInt(quantity, 10);

      if (isNaN(quantity) || quantity <= 0) {
        return res.status(400).json({
          error: "Quantity must be a valid number greater than zero",
        });
      }

      await Cart.findByIdAndUpdate(id, { quantity, total });
      res.status(200).json({ message: "Item updated successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateUserCartStatus(req, res) {
    const userId = req.user.id;
    const { status } = req.body;

    try {
      const updatedCart = await Cart.updateMany({ userId }, { status });
      res.status(200).json({
        message: "Cart status updated successfully",
        cartItems: updatedCart,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = CartController;
