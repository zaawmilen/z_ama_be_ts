
// src/controllers/productController.ts
import { Request, Response } from "express";
import { ProductModel } from "../models/productModel";

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Add a new product
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock } = req.body;
  try {
    const newProduct = new ProductModel({ name, description, price, stock });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
};
