const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI ;
  await mongoose.connect(uri, {
    // options not required with mongoose 6+, kept for clarity
  });
  console.log('Connected to MongoDB');
};

module.exports = connectDB;