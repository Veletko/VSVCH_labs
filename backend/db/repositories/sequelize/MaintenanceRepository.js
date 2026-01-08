const BaseRepository = require('./BaseRepository');
const { MaintenanceHistory, Machine, Master } = require('../../../models/associations');

class MaintenanceRepository extends BaseRepository {
  constructor() {
    super(MaintenanceHistory);
  }

  /**
   * Получить все записи обслуживания с детальной информацией
   */
  async findAllDetailed(options = {}) {
    const {
      where = {},
      include = [],
      order = [['start_date', 'DESC']],
      limit,
      offset
    } = options;

    return await this.findAndCountAll({
      where,
      include: [
        {
          model: Machine,
          as: 'machine',
          required: false
        },
        {
          model: Master,
          as: 'master',
          required: false
        },
        ...include
      ],
      order,
      limit,
      offset
    });
  }

  /**
   * Получить запись обслуживания с детальной информацией по ID
   */
  async findByIdDetailed(id) {
    return await this.findById(id, {
      include: [
        {
          model: Machine,
          as: 'machine'
        },
        {
          model: Master,
          as: 'master'
        }
      ]
    });
  }

  /**
   * Получить записи по состоянию
   */
  async findByState(state, options = {}) {
    return await this.findAllDetailed({
      where: {
        state,
        ...options.where
      },
      ...options
    });
  }
}

module.exports = MaintenanceRepository;
