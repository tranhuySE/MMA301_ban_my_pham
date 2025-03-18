const express = require("express");
const productController = require("../controllers/Product.controller");
const { verifyToken } = require("../middlewares/authentication");

const productRouter = express.Router();
productRouter.get("/", productController.getAllProducts);
productRouter.get("/:id", productController.getProductById);
productRouter.post("/", productController.createProduct);
productRouter.put("/:id", verifyToken, productController.updateProduct);
productRouter.delete("/:id", verifyToken, productController.deleteProduct);
productRouter.get(
  "/category/:categoryId",
  productController.getProductsByCategory
);

module.exports = productRouter;
