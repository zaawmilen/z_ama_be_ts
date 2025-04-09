import { Request, Response } from 'express';
const bcrypt = require('bcryptjs');

import { IUser, UserModel } from '../models/userModel';
import { generateToken } from '../utils/generateToken';

// Register a new user
export const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({ name, email, password: hashedPassword });

    const token = generateToken(newUser._id.toString());

    res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email, token });
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id.toString());


    res.status(200).json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in' });
  }
};
