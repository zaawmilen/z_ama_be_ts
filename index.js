const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const dotenv = require("dotenv");


dotenv.config();

admin.initializeApp();

exports.createStripeCheckoutSession = functions.https.onCall(async (data, context) => {
  try {
    const { items } = data;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: 'https://yourdomain.com/success',
      cancel_url: 'https://yourdomain.com/cancel',
    });
    return { id: session.id };
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    throw new functions.https.HttpsError('internal', 'Unable to create Stripe session', error);
  }
});

console.log("Firebase Functions and Stripe integration set up successfully.");
