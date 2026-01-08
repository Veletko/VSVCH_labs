// config/database.js
// Абстракция для подключения к разным базам данных
const dbType = process.env.DB_TYPE || 'sequelize';

let dbAdapter;
let connection;

try {
  switch (dbType.toLowerCase()) {
    case 'sequelize':
      const { Sequelize } = require('sequelize');
      connection = new Sequelize(
        process.env.DB_NAME || 'your_database',
        process.env.DB_USER || 'your_username',
        process.env.DB_PASSWORD || 'your_password',
        {
          host: process.env.DB_HOST || 'localhost',
          port: process.env.DB_PORT || 5432,
          dialect: 'postgres',
          logging: process.env.NODE_ENV === 'development' ? console.log : false,
          pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      );
      
      // Импортируем адаптер и передаем connection
      const SequelizeAdapter = require('../db/adapters/SequelizeAdapter');
      dbAdapter = new SequelizeAdapter(connection);
      break;
    
    // Для будущей поддержки других БД
    // case 'mongoose':
    //   const mongoose = require('mongoose');
    //   connection = mongoose;
    //   const MongooseAdapter = require('../db/adapters/MongooseAdapter');
    //   dbAdapter = new MongooseAdapter();
    //   break;
    
    // case 'prisma':
    //   const { PrismaClient } = require('@prisma/client');
    //   connection = new PrismaClient();
    //   const PrismaAdapter = require('../db/adapters/PrismaAdapter');
    //   dbAdapter = new PrismaAdapter();
    //   break;
    
    default:
      throw new Error(`Unsupported database type: ${dbType}. Supported types: sequelize`);
  }
} catch (error) {
  console.error('Error initializing database:', error);
  throw error;
}

// Экспортируем подключение для обратной совместимости
module.exports = connection;

// Экспортируем адаптер
module.exports.dbAdapter = dbAdapter;
module.exports.dbType = dbType;
