const express = require("express");
const orderController = require("../controllers/Order.controller");
const { verifyToken } = require("../middlewares/authentication");

const orderRouter = express.Router();
orderRouter.get("/", verifyToken, orderController.getAllOrders);
orderRouter.get("/:id", verifyToken, orderController.getOrderById);
orderRouter.post("/", verifyToken, orderController.createOrder);

module.exports = orderRouter;
