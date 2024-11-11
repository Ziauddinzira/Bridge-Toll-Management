const express = require('express');
const Vehicle = require('../models/Vehicle');  // Vehicle model to fetch vehicle details
const Payment = require('../models/Payment');  // Payment model to store payment records
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  // Stripe initialized with secret key
const router = express.Router();  // Express router to handle payment-related routes

// Route to handle payment initiation
router.post('/pay', async (req, res) => {
  const { vehicleId, amount } = req.body;  // Extract vehicleId and amount from request body

  try {
    // Find the vehicle by ID from the database
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });  // Return 404 if vehicle is not found
    }

    // Check if the vehicle is exempt from toll payments (e.g., emergency vehicles)
    const exemptVehicles = ['ambulance', 'school bus', 'fire service', 'police'];
    if (exemptVehicles.includes(vehicle.type)) {
      return res.status(200).json({ message: 'Exempt vehicle. No payment required.' });
    }

    // Create a Checkout Session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],  // Define payment method as card
      line_items: [
        {
          price_data: {
            currency: 'usd',  // Currency for the payment
            product_data: {
              name: `Toll Fee for ${vehicle.vehicleNumber}`,  // Display name of the product in Stripe
            },
            unit_amount: amount * 100,  // Stripe expects the amount in cents (100 cents = 1 dollar)
          },
          quantity: 1,  // Only 1 unit of the toll fee
        },
      ],
      mode: 'payment',  // Mode for the session is 'payment' (for a one-time payment)
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,  // Redirect after successful payment
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,  // Redirect if payment is canceled
    });

    // Record the payment details in the database with status as 'pending'
    const payment = await Payment.create({
      vehicleId: vehicle._id,  // Store the associated vehicle ID
      amount,
      status: 'pending',  // Initially, the payment status is 'pending'
      stripeSessionId: session.id,  // Store the Stripe session ID for reference
    });

    // Send back the payment URL (Stripe's checkout session URL) to the client
    res.status(201).json({ paymentUrl: session.url });
  } catch (error) {
    console.error('Error during payment processing:', error);
    res.status(500).json({ error: 'Payment failed', details: error.message });  // Return error if payment fails
  }
});

module.exports = router;  // Export the router to be used in server.js
