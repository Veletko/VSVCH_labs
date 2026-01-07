// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database'); // Изменено: импорт MongoDB подключения

// Импортируем модели (ассоциации больше не нужны)
const Master = require('./models/Master');
const Worker = require('./models/Worker');
const Machine = require('./models/Machine');
const MaintenanceHistory = require('./models/MaintenanceHistory');

// Импортируем маршруты
const masterRoutes = require('./routes/masters');
const workerRoutes = require('./routes/workers');
const machineRoutes = require('./routes/machines');
const maintenanceRoutes = require('./routes/maintenance');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Подключаем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Тестовый маршрут
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Factory API is running with MongoDB!',
    timestamp: new Date().toISOString(),
    database: 'MongoDB',
    endpoints: {
      auth: '/api/auth',
      masters: '/api/masters',
      workers: '/api/workers',
      machines: '/api/machines',
      maintenance: '/api/maintenance'
    }
  });
});

// Подключение к MongoDB и запуск сервера
const startServer = async () => {
  try {
    // Подключаемся к MongoDB
    await connectDB();
    console.log('✅ MongoDB connection established successfully.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`👨‍🔧 Masters API: http://localhost:${PORT}/api/masters`);
      console.log(`👷 Workers API: http://localhost:${PORT}/api/workers`);
      console.log(`⚙️  Machines API: http://localhost:${PORT}/api/machines`);
      console.log(`📋 Maintenance API: http://localhost:${PORT}/api/maintenance`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();