// src/controllers/userController.ts
import { Request, Response } from "express";
import { UserModel } from "../models/userModel"; // Correctly import UserModel

// Get all users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find(); // Correctly use UserModel to fetch users
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Add a new user
export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const newUser = new UserModel({ // Correctly use UserModel to create a new user
      name,
      email,
      password,
    });

    const savedUser = await newUser.save(); // Save the new user
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};
