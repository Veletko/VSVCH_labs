/**
 * Фабрика репозиториев
 * Создает экземпляры репозиториев в зависимости от типа БД
 */
const dbType = process.env.DB_TYPE || 'sequelize';

// Импортируем репозитории Sequelize
let MasterRepository, WorkerRepository, MachineRepository, MaintenanceRepository;

try {
  switch (dbType.toLowerCase()) {
    case 'sequelize':
      MasterRepository = require('../repositories/sequelize/MasterRepository');
      WorkerRepository = require('../repositories/sequelize/WorkerRepository');
      MachineRepository = require('../repositories/sequelize/MachineRepository');
      MaintenanceRepository = require('../repositories/sequelize/MaintenanceRepository');
      break;
    
    // Для будущей поддержки других БД
    // case 'mongoose':
    //   MasterRepository = require('../repositories/mongoose/MasterRepository');
    //   WorkerRepository = require('../repositories/mongoose/WorkerRepository');
    //   MachineRepository = require('../repositories/mongoose/MachineRepository');
    //   MaintenanceRepository = require('../repositories/mongoose/MaintenanceRepository');
    //   break;
    
    // case 'prisma':
    //   MasterRepository = require('../repositories/prisma/MasterRepository');
    //   WorkerRepository = require('../repositories/prisma/WorkerRepository');
    //   MachineRepository = require('../repositories/prisma/MachineRepository');
    //   MaintenanceRepository = require('../repositories/prisma/MaintenanceRepository');
    //   break;
    
    default:
      throw new Error(`Unsupported database type: ${dbType}`);
  }
} catch (error) {
  console.error('Error loading repositories:', error);
  throw error;
}

class RepositoryFactory {
  /**
   * Получить репозиторий мастеров
   */
  static getMasterRepository() {
    if (!MasterRepository) {
      throw new Error('MasterRepository is not available for the selected database type');
    }
    return new MasterRepository();
  }

  /**
   * Получить репозиторий рабочих
   */
  static getWorkerRepository() {
    if (!WorkerRepository) {
      throw new Error('WorkerRepository is not available for the selected database type');
    }
    return new WorkerRepository();
  }

  /**
   * Получить репозиторий машин
   */
  static getMachineRepository() {
    if (!MachineRepository) {
      throw new Error('MachineRepository is not available for the selected database type');
    }
    return new MachineRepository();
  }

  /**
   * Получить репозиторий обслуживания
   */
  static getMaintenanceRepository() {
    if (!MaintenanceRepository) {
      throw new Error('MaintenanceRepository is not available for the selected database type');
    }
    return new MaintenanceRepository();
  }

  /**
   * Получить текущий тип БД
   */
  static getDbType() {
    return dbType;
  }
}

module.exports = RepositoryFactory;
