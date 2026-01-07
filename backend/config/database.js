const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Используем строку подключения из .env или локальную MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Fuctory';
    
    // В Mongoose 6+ useNewUrlParser и useUnifiedTopology больше не нужны
    const conn = await mongoose.connect(mongoURI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error(`❌ Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;