// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = 5001;

app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', (req, res) => {
  const { amount } = req.body;

  // Simulate creating a payment intent
  setTimeout(() => {
    res.send({ clientSecret: 'mock_client_secret' });
  }, 1000); // Simulate network delay
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
