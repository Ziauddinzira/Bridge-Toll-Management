const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle'); // Assuming Vehicle model is correctly defined in models folder

// POST /api/vehicles - Add a new vehicle
router.post('/', async (req, res) => {
  try {
    const { vehicleNumber, type } = req.body;

    if (!vehicleNumber || !type) {
      return res.status(400).json({ error: 'Vehicle number and type are required.' });
    }

    const newVehicle = new Vehicle({ vehicleNumber, type });
    const savedVehicle = await newVehicle.save();

    res.status(201).json(savedVehicle);
  } catch (error) {
    console.error('Error adding vehicle:', error); // Log error to console
    res.status(500).json({ error: 'Failed to add vehicle', details: error.message });
  }
});

module.exports = router;
