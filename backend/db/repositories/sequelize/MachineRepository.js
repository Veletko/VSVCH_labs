const BaseRepository = require('./BaseRepository');
const { Machine, MaintenanceHistory, Master } = require('../../../models/associations');

class MachineRepository extends BaseRepository {
  constructor() {
    super(Machine);
  }

  /**
   * Получить машину с историей обслуживания
   */
  async findByIdWithMaintenance(id) {
    return await this.findById(id, {
      include: [{
        model: MaintenanceHistory,
        as: 'maintenanceHistory',
        include: [{
          model: Master,
          as: 'master'
        }]
      }]
    });
  }

  /**
   * Получить статистику по машине
   */
  async getStatistics(id) {
    const machine = await this.findById(id);
    if (!machine) {
      return null;
    }

    const maintenanceCount = await MaintenanceHistory.count({
      where: { machine_id: id }
    });

    const completedMaintenance = await MaintenanceHistory.count({
      where: {
        machine_id: id,
        state: 'completed'
      }
    });

    const inProgressMaintenance = await MaintenanceHistory.count({
      where: {
        machine_id: id,
        state: 'in_progress'
      }
    });

    return {
      machine,
      maintenanceCount,
      completedMaintenance,
      inProgressMaintenance,
      completionRate: maintenanceCount > 0 
        ? (completedMaintenance / maintenanceCount * 100).toFixed(2) 
        : 0
    };
  }

  /**
   * Удалить машину вместе с связанными записями обслуживания
   */
  async deleteWithDependencies(id, transaction = null) {
    const { MaintenanceHistory } = require('../../../models/associations');
    
    // Удаляем связанные записи обслуживания
    await MaintenanceHistory.destroy({
      where: { machine_id: id },
      transaction
    });
    
    // Удаляем машину (передаем транзакцию)
    return await this.delete(id, transaction);
  }
}

module.exports = MachineRepository;
