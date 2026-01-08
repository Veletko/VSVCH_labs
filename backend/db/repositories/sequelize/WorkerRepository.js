const BaseRepository = require('./BaseRepository');
const { Worker, Master } = require('../../../models/associations');

class WorkerRepository extends BaseRepository {
  constructor() {
    super(Worker);
  }

  /**
   * Получить всех рабочих с их мастерами
   */
  async findAllWithMaster(options = {}) {
    const {
      where = {},
      include = [],
      order = [['id', 'ASC']],
      limit,
      offset
    } = options;

    return await this.findAndCountAll({
      where,
      include: [
        {
          model: Master,
          as: 'master',
          required: false // LEFT JOIN
        },
        ...include
      ],
      order,
      limit,
      offset
    });
  }

  /**
   * Получить рабочего с мастером по ID
   */
  async findByIdWithMaster(id) {
    return await this.findById(id, {
      include: [{
        model: Master,
        as: 'master'
      }]
    });
  }
}

module.exports = WorkerRepository;
