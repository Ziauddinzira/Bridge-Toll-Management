require('dotenv').config(); // This should load your environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const vehicleRoutes = require('./routes/vehicleRoutes');
const Vehicle = require('./models/Vehicle'); // Adjust the path if necessary
const paymentRoutes = require('./routes/paymentRoutes');


// Make sure you are accessing the correct variable
console.log(process.env.STRIPE_SECRET_KEY); 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Make sure STRIPE_SECRET_KEY is correctly accessed

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});


// Sample route
app.get('/api/vehicles', async (req, res) => {
  try {
    console.log('Attempting to fetch vehicles...');
    const vehicles = await Vehicle.find();
    if (vehicles.length === 0) {
      console.log('No vehicles found in the database.');
    } else {
      console.log('Vehicles fetched:', vehicles);
    }
    res.status(200).json(vehicles); // Returns the array of vehicles
  } catch (err) {
    console.error('Error retrieving vehicles:', err); // Log the full error object
    res.status(500).json({ error: 'Failed to retrieve vehicles', details: err.message });
  }
});


// Listen for requests
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
