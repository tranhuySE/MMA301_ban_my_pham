const express = require("express");
const cartController = require("../controllers/Cart.controller");
const { verifyToken } = require("../middlewares/authentication");

const cartRouter = express.Router();
cartRouter.get("/", verifyToken, cartController.getCartByUserId);
cartRouter.post("/", verifyToken, cartController.addToCart);
cartRouter.delete("/", verifyToken, cartController.removeFromCart);

module.exports = cartRouter;
