import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { logger } from "./middleware/logger";
import { errorHandler } from "./middleware/errorHandler";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from './routes/authRoutes';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
if (!stripe) {
  throw new Error('Stripe secret key is not defined in environment variables');
}

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URI || "", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Use the logger middleware
app.use(logger);

// CORS - restrict to frontend
app.use(cors({ origin: 'https://z-eccom2.netlify.app' }));

// Middleware for parsing JSON
app.use(express.json());

// Use routes
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/orders", orderRoutes);
app.use("/auth", authRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);
// Type definition for incoming item
interface CartItem {
  price: number;
  quantity: number;
}

// Stripe Payment Intent endpoint
app.post('/create-payment-intent', async (req: Request, res: Response) => {
  try {
    const { items }: { items: CartItem[] } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invalid items array.' });
    }

    const amount = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ) * 100;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Unable to create payment intent');
  }
});

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello from the backend!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
