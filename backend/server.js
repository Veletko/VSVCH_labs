require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const { dbAdapter, dbType } = require('./config/database');

// Импортируем ассоциации (для Sequelize)
if (dbType === 'sequelize') {
  require('./models/associations');
}

// Импортируем маршруты
const masterRoutes = require('./routes/masters');
const workerRoutes = require('./routes/workers');
const machineRoutes = require('./routes/machines');
const maintenanceRoutes = require('./routes/maintenance');
const workshopRoutes = require('./routes/workshops');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключаем маршруты
app.use('/api/auth', authRoutes);
app.use('/api/masters', masterRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/workshops', workshopRoutes);

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
      maintenance: '/api/maintenance',
      workshops: '/api/workshops'
    }
  });
});

// Подключение к базе данных и запуск сервера
const startServer = async () => {
  try {
    // Используем адаптер для подключения к БД
    await dbAdapter.authenticate();
    console.log(`✅ Database connection established successfully (${dbType}).`);
    
    // Синхронизируем модели с базой данных (только для Sequelize)
    if (dbType === 'sequelize') {
      await dbAdapter.sync({ force: false }); // force: true только в разработке!
      console.log('✅ Database models synchronized.');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📊 Database Type: ${dbType}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
      console.log(`👨‍🔧 Masters API: http://localhost:${PORT}/api/masters`);
      console.log(`👷 Workers API: http://localhost:${PORT}/api/workers`);
      console.log(`⚙️  Machines API: http://localhost:${PORT}/api/machines`);
      console.log(`📋 Maintenance API: http://localhost:${PORT}/api/maintenance`);
      console.log(`🏭 Workshops API: http://localhost:${PORT}/api/workshops`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();