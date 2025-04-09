// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  clientSecret: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
