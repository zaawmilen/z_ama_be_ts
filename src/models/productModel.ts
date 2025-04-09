// models/Product.ts
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
});

export const ProductModel = mongoose.model("Product", ProductSchema);
