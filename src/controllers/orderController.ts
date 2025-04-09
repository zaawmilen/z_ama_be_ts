// src/controllers/orderController.ts
import { Request, Response } from "express";
import Order from "../models/orderModel"; // Import Order model

// Get all orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find(); // Mongoose query to find all orders
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
};

// Create an order
export const createOrder = async (req: Request, res: Response) => {
  const { userId, productIds, status, totalAmount } = req.body;
  try {
    const newOrder = new Order({
      userId,
      productIds,
      status,
      totalAmount,
    });

    const savedOrder = await newOrder.save(); // Mongoose save method
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Error creating order" });
  }
};
