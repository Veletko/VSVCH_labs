const Master = require('./Master');
const Worker = require('./Worker');
const Machine = require('./Machine');
const MaintenanceHistory = require('./MaintenanceHistory');
const Workshop = require('./Workshop');

// Мастер имеет много рабочих
Master.hasMany(Worker, {
  foreignKey: 'master_id',
  as: 'workers',
  onDelete: 'CASCADE' // При удалении мастера удаляются его рабочие
});

// Рабочий принадлежит мастеру
Worker.belongsTo(Master, {
  foreignKey: 'master_id',
  as: 'master',
  onDelete: 'CASCADE'
});

// Мастер имеет много записей обслуживания
Master.hasMany(MaintenanceHistory, {
  foreignKey: 'master_id',
  as: 'maintenanceHistory',
  onDelete: 'CASCADE' // При удалении мастера удаляются его записи обслуживания
});

// Машина имеет много записей обслуживания
Machine.hasMany(MaintenanceHistory, {
  foreignKey: 'machine_id',
  as: 'maintenanceHistory',
  onDelete: 'CASCADE' // При удалении машины удаляются связанные записи обслуживания
});

// Запись обслуживания принадлежит мастеру
MaintenanceHistory.belongsTo(Master, {
  foreignKey: 'master_id',
  as: 'master',
  onDelete: 'CASCADE'
});

// Запись обслуживания принадлежит машине
MaintenanceHistory.belongsTo(Machine, {
  foreignKey: 'machine_id',
  as: 'machine',
  onDelete: 'CASCADE'
});

module.exports = {
  Master,
  Worker,
  Machine,
  MaintenanceHistory,
  Workshop
};