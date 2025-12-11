// Загружаем модели
const Master = require('./Master');
const Worker = require('./Worker');
const Machine = require('./Machine');
const MaintenanceHistory = require('./MaintenanceHistory');

// Устанавливаем ассоциации только после полной загрузки всех моделей

// Master - Worker (One-to-Many)
Master.hasMany(Worker, {
  foreignKey: 'master_id',
  as: 'workers'
});

Worker.belongsTo(Master, {
  foreignKey: 'master_id',
  as: 'master'
});

// Master - MaintenanceHistory (One-to-Many)
Master.hasMany(MaintenanceHistory, {
  foreignKey: 'master_id',
  as: 'maintenanceHistory'
});

MaintenanceHistory.belongsTo(Master, {
  foreignKey: 'master_id',
  as: 'master'
});

// Machine - MaintenanceHistory (One-to-Many)
Machine.hasMany(MaintenanceHistory, {
  foreignKey: 'machine_id',
  as: 'maintenanceHistory'
});

MaintenanceHistory.belongsTo(Machine, {
  foreignKey: 'machine_id',
  as: 'machine'
});

// Экспортируем модели
module.exports = {
  Master,
  Worker,
  Machine,
  MaintenanceHistory
};