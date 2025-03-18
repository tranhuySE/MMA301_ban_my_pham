const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCartByUserId = async (req, res) => {
  try {
    const userId = req.userID;
    const cart = await Cart.findOne({ user_id: userId }).populate(
      "products.product_id"
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, name, quantity, price } = req.body;
    let cart = await Cart.findOne({ user_id });

    if (!cart) {
      cart = new Cart({ user_id, products: [], total_price: 0 });
    }

    const productIndex = cart.products.findIndex((p) =>
      p.product_id.equals(product_id)
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ product_id, name, quantity, price });
    }

    cart.total_price = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    let cart = await Cart.findOne({ user_id });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(
      (p) => !p.product_id.equals(product_id)
    );
    cart.total_price = cart.products.reduce(
      (sum, p) => sum + p.quantity * p.price,
      0
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
