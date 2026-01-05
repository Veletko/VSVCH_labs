require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');

// Импортируем ассоциации
require('./models/associations');

// Импортируем маршруты
const masterRoutes = require('./routes/masters');
const workerRoutes = require('./routes/workers');
const machineRoutes = require('./routes/machines');
const maintenanceRoutes = require('./routes/maintenance');
const authRoutes = require('./routes/auth'); // НОВЫЙ ИМПОРТ

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/auth', authRoutes); // НОВЫЙ МАРШРУТ
app.use('/api/masters', masterRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance', maintenanceRoutes);

// Тестовый маршрут
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Factory API is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      masters: '/api/masters',
      workers: '/api/workers', 
      machines: '/api/machines',
      maintenance: '/api/maintenance'
    }
  });
});

// Подключение к базе данных и запуск сервера
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Синхронизируем модели с базой данных
    await sequelize.sync({ force: false }); // force: true только в разработке!
    console.log('✅ Database synchronized.');
    
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