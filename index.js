// Import necessary packages
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();

// Initialize Express app
const app = express();

// Use CORS middleware for handling Cross-Origin requests
// app.use(cors({ origin:  true }));

app.use(cors({ origin:  'https://z-eccomerce.netlify.app' }));

// Parse incoming request bodies in a middleware before your handlers, available under the req.body property
app.use(express.json());

// Stripe Payment Intent endpoint
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { items } = req.body;
 // Ensure items is an array and not empty
 if (!Array.isArray(items) || items.length === 0) {
  return res.status(400).json({ error: 'Invalid items array.' });
}
    // Calculate the total amount in cents
    const amount = items.reduce((total, item) => total + item.price * item.quantity, 0) * 100;

    // Create a payment intent with the calculated amount
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
    });

    // Send the client secret of the payment intent to the frontend
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).send('Unable to create payment intent');
  }
});

// Example route
app.get('/', (req, res) => {
  res.status(200).send('Hello from the backend!');
});

// Start the server on a specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
