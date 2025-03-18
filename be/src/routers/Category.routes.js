const express = require("express");
const categoryController = require("../controllers/Category.controller");
const { verifyToken } = require("../middlewares/authentication");

const categoryRouter = express.Router();
categoryRouter.get("/", categoryController.getAllCategories);
categoryRouter.post("/", verifyToken, categoryController.createCategory);

module.exports = categoryRouter;
