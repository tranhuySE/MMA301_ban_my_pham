const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
