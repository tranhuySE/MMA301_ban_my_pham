const express = require("express");
const productRouter = require("./Product.routes");
const userRouter = require("./User.routes");
const categoryRouter = require("./Category.routes");
const orderRouter = require("./Order.routes");
const cartRouter = require("./Cart.routes");
const addressRouter = require("./Address.routes");

const router = express.Router();
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/categories", categoryRouter);
router.use("/orders", orderRouter);
router.use("/carts", cartRouter);
router.use("/address", addressRouter);

module.exports = router;
