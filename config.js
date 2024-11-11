require('dotenv').config();

module.exports = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};