/**
 * Базовый контроллер
 * Использует репозитории для работы с данными вместо прямого доступа к моделям
 */
class BaseController {
  constructor(repository) {
    if (!repository) {
      throw new Error('Repository is required for BaseController');
    }
    this.repository = repository;
  }

  // Получить все записи
  getAll = async (req, res) => {
    try {
      const {
        page,
        limit,
        sortBy = 'id',
        sortOrder = 'ASC',
        ...filters
      } = req.query;

      let records;
      let count;

      if (page && limit) {
        // Пагинация
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const result = await this.repository.findAndCountAll({
          where: filters,
          order: [[sortBy, sortOrder]],
          limit: parseInt(limit),
          offset
        });
        records = result.rows;
        count = result.count;
      } else {
        // Без пагинации
        records = await this.repository.findAll({
          where: filters,
          order: [[sortBy, sortOrder]]
        });
        count = records.length;
      }

      const response = {
        success: true,
        data: records,
        count
      };

      if (page && limit) {
        response.pagination = {
          current: parseInt(page),
          total: count,
          pages: Math.ceil(count / parseInt(limit)),
          limit: parseInt(limit)
        };
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с сортировкой
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = 'id', sortOrder = 'ASC' } = req.query;
      const records = await this.repository.findAll({
        order: [[sortBy, sortOrder]]
      });
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с фильтрацией
  getAllFiltered = async (req, res) => {
    try {
      const where = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          where[key] = req.query[key];
        }
      });

      const records = await this.repository.findAll({ where });
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Поиск записей
  search = async (req, res) => {
    try {
      const { q, field, operator = 'OR' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      // Если указано одно поле
      const fields = field ? [field] : ['name', 'last_name', 'first_name'];

      const records = await this.repository.search({
        fields,
        query: q,
        operator
      }, req.query);

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить запись по ID
  getById = async (req, res) => {
    try {
      const record = await this.repository.findById(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Проверить существование записи
  exists = async (req, res) => {
    try {
      const exists = await this.repository.exists(req.params.id);
      res.json({
        success: true,
        exists
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Создать новую запись
  create = async (req, res) => {
    try {
      const record = await this.repository.create(req.body);
      
      res.status(201).json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Обновить запись
  update = async (req, res) => {
    try {
      const record = await this.repository.update(req.params.id, req.body);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Удалить запись
  delete = async (req, res) => {
    try {
      const deleted = await this.repository.delete(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Запись успешно удалена'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = BaseController;
