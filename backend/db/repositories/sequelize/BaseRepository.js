/**
 * Базовый репозиторий для Sequelize
 * Реализует общие методы для работы с данными через Sequelize ORM
 */
const IRepository = require('../../interfaces/IRepository');
const { Op } = require('sequelize');

class BaseRepository extends IRepository {
  constructor(model) {
    super();
    if (!model) {
      throw new Error('Model is required for BaseRepository');
    }
    this.model = model;
  }

  /**
   * Получить все записи
   */
  async findAll(options = {}) {
    const {
      where = {},
      include = [],
      order = [['id', 'ASC']],
      limit,
      offset,
      attributes,
      group,
      having
    } = options;

    const queryOptions = {
      where: this.buildWhereClause(where),
      order,
      include: include.length > 0 ? include : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      attributes,
      group,
      having
    };

    // Удаляем undefined значения
    Object.keys(queryOptions).forEach(key => 
      queryOptions[key] === undefined && delete queryOptions[key]
    );

    return await this.model.findAll(queryOptions);
  }

  /**
   * Найти запись по ID
   */
  async findById(id, options = {}) {
    const {
      include = [],
      attributes
    } = options;

    const queryOptions = {
      where: { id: this.parseId(id) },
      include: include.length > 0 ? include : undefined,
      attributes
    };

    Object.keys(queryOptions).forEach(key => 
      queryOptions[key] === undefined && delete queryOptions[key]
    );

    return await this.model.findByPk(this.parseId(id), queryOptions);
  }

  /**
   * Создать новую запись
   */
  async create(data) {
    return await this.model.create(data);
  }

  /**
   * Обновить запись
   */
  async update(id, data) {
    const record = await this.findById(id);
    if (!record) {
      return null;
    }
    await record.update(data);
    return record.reload();
  }

  /**
   * Удалить запись
   */
  async delete(id, transaction = null) {
    const record = await this.findById(id);
    if (!record) {
      return false;
    }
    await record.destroy({ transaction });
    return true;
  }

  /**
   * Проверить существование записи
   */
  async exists(id) {
    const record = await this.findById(id);
    return !!record;
  }

  /**
   * Поиск записей
   */
  async search(criteria, options = {}) {
    const {
      fields = [],
      query = '',
      operator = 'OR' // OR или AND
    } = criteria;

    if (!query || fields.length === 0) {
      return [];
    }

    const whereClause = {
      [Op[operator === 'AND' ? 'and' : 'or']]: fields.map(field => ({
        [field]: {
          [Op.iLike]: `%${query}%`
        }
      }))
    };

    return await this.findAll({
      ...options,
      where: {
        ...options.where,
        ...whereClause
      }
    });
  }

  /**
   * Подсчет записей
   */
  async count(criteria = {}) {
    return await this.model.count({
      where: this.buildWhereClause(criteria)
    });
  }

  /**
   * Найти и подсчитать (для пагинации)
   */
  async findAndCountAll(options = {}) {
    const {
      where = {},
      include = [],
      order = [['id', 'ASC']],
      limit,
      offset,
      attributes
    } = options;

    const queryOptions = {
      where: this.buildWhereClause(where),
      order,
      include: include.length > 0 ? include : undefined,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      attributes
    };

    Object.keys(queryOptions).forEach(key => 
      queryOptions[key] === undefined && delete queryOptions[key]
    );

    return await this.model.findAndCountAll(queryOptions);
  }

  /**
   * Вспомогательный метод для построения WHERE-условий
   */
  buildWhereClause(where) {
    if (!where || typeof where !== 'object') {
      return {};
    }

    const result = {};
    
    for (const [key, value] of Object.entries(where)) {
      if (value === null || value === undefined || value === '') {
        continue;
      }

      // Поддержка операторов Sequelize
      if (typeof value === 'object' && !Array.isArray(value)) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Парсинг ID (преобразование строки в число, если нужно)
   */
  parseId(id) {
    if (typeof id === 'string' && /^\d+$/.test(id)) {
      return parseInt(id, 10);
    }
    return id;
  }

  /**
   * Получить модель (для сложных запросов)
   */
  getModel() {
    return this.model;
  }
}

module.exports = BaseRepository;
