const Order = require("../models/Order");
const Cart = require("../models/Cart");

exports.createOrder = async (req, res) => {
  try {
    const { user_id } = req.body;
    const cart = await Cart.findOne({ user_id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: user_id,
      products: cart.products,
      total: cart.total_price,
      status: "pending",
    });

    await order.save();
    await Cart.deleteOne({ user_id }); // Xóa giỏ hàng sau khi đặt hàng

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate(
      "products.product_id"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "products.product_id"
    );
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("products.product_id");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
