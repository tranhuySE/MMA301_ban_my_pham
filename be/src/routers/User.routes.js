const express = require("express");
const userController = require("../controllers/User.controller");
const { verifyToken } = require("../middlewares/authentication");

const userRouter = express.Router();
userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
// userRouter.get("/", verifyToken, userController.getAllUsers);
// userRouter.get("/:id", verifyToken, userController.getUserById);
// userRouter.put("/:id", verifyToken, userController.updateUser);
// userRouter.delete("/:id", verifyToken, userController.deleteUser);

module.exports = userRouter;
