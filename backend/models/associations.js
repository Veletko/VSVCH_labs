// models/associations.js - ЭТОТ ФАЙЛ БОЛЬШЕ НЕ НУЖЕН
// В MongoDB связи реализуются через ссылки (ObjectId) в схемах
// Удалите этот файл или оставьте пустым

// Экспортируем только модели
const Master = require('./Master');
const Worker = require('./Worker');
const Machine = require('./Machine');
const MaintenanceHistory = require('./MaintenanceHistory');

module.exports = {
  Master,
  Worker,
  Machine,
  MaintenanceHistory
};