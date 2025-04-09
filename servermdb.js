// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Payment = require('./src/models/Payment');

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  // Simulate creating a payment intent
  setTimeout(async () => {
    const clientSecret = 'mock_client_secret';

    // Save payment information to MongoDB
    try {
      const payment = new Payment({ amount, clientSecret });
      await payment.save();
      res.send({ clientSecret });
    } catch (error) {
      console.error('Error saving payment:', error);
      res.status(500).send({ error: 'Error saving payment' });
    }
  }, 1000); // Simulate network delay
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
