const BaseRepository = require('./BaseRepository');
const { Master, Worker, MaintenanceHistory, Machine } = require('../../../models/associations');

class MasterRepository extends BaseRepository {
  constructor() {
    super(Master);
  }

  /**
   * Получить всех мастеров с их обслуживаниями
   */
  async findAllWithMaintenance(options = {}) {
    const {
      page = 1,
      limit = 10,
      sortBy = 'id',
      sortOrder = 'ASC'
    } = options;

    const offset = (page - 1) * limit;

    return await this.findAndCountAll({
      include: [{
        model: MaintenanceHistory,
        as: 'maintenanceHistory',
        include: [{
          model: Machine,
          as: 'machine'
        }]
      }],
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  }

  /**
   * Получить мастера с обслуживанием по ID
   */
  async findByIdWithMaintenance(id) {
    return await this.findById(id, {
      include: [{
        model: MaintenanceHistory,
        as: 'maintenanceHistory',
        include: [{
          model: Machine,
          as: 'machine'
        }]
      }]
    });
  }

  /**
   * Получить статистику по мастеру
   */
  async getStatistics(id) {
    const master = await this.findById(id);
    if (!master) {
      return null;
    }

    const workersCount = await Worker.count({
      where: { master_id: id }
    });

    const maintenanceCount = await MaintenanceHistory.count({
      where: { master_id: id }
    });

    const completedMaintenance = await MaintenanceHistory.count({
      where: {
        master_id: id,
        state: 'completed'
      }
    });

    return {
      master,
      workersCount,
      maintenanceCount,
      completedMaintenance,
      completionRate: maintenanceCount > 0 
        ? (completedMaintenance / maintenanceCount * 100).toFixed(2) 
        : 0
    };
  }
}

module.exports = MasterRepository;
