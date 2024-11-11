const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  amount: Number,
  status: { type: String, enum: ['success', 'failed', 'pending'] },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
