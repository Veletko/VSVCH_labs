const BaseRepository = require('./BaseRepository');
const { Workshop } = require('../../../models/associations');

class WorkshopRepository extends BaseRepository {
  constructor() {
    super(Workshop);
  }

  /**
   * Получить все схемы цеха с сортировкой по дате создания
   */
  async findAllSorted(options = {}) {
    const {
      where = {},
      order = [['created_at', 'DESC']],
      limit,
      offset
    } = options;

    return await this.findAndCountAll({
      where,
      order,
      limit,
      offset
    });
  }

  /**
   * Получить схему цеха по имени
   */
  async findByName(name) {
    return await this.findOne({
      where: { name }
    });
  }
}

module.exports = WorkshopRepository;
