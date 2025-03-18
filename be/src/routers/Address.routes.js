const express = require("express");
const addressController = require("../controllers/Address.controller");

const addressRouter = express.Router();
addressRouter.get("/all/:userId", addressController.getAllAddresses);
addressRouter.post("/add", addressController.createAddress);
addressRouter.get("/:id", addressController.getAddressById);
addressRouter.delete("/:id", addressController.deleteAddress);
addressRouter.put("/:id/default", addressController.setDefaultAddress);

module.exports = addressRouter;
