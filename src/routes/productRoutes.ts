import express, { Request, Response } from "express";
import Product from "../models/productModel";

const router = express.Router();

// Create a new product
router.post("/add", async (req: Request, res: Response) => {
  try {
    const { name, price, description, stock } = req.body;
    const newProduct = new Product({
      name,
      price,
      description,
      stock,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product" });
  }
});

// Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products" });
  }
});

export default router;
