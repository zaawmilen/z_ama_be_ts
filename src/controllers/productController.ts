// src/controllers/productController.ts
import { Request, Response } from "express";
import { Product } from "../types/product";
import knex from "../db"; // Assuming db is initialized as knex

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products: Product[] = await knex("products").select("*");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Add a new product
export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, stock }: Product = req.body;
  try {
    const newProduct = await knex("products").insert({ name, description, price, stock });
    res.status(201).json({ id: newProduct[0], name, description, price, stock });
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
};

