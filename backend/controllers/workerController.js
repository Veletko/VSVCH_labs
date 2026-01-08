const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class WorkerController extends BaseController {
  constructor() {
    super(RepositoryFactory.getWorkerRepository());
  }

  // Переопределяем getAll чтобы всегда включать мастера
  getAll = async (req, res) => {
    try {
      const {
        page,
        limit,
        sortBy = 'id',
        sortOrder = 'ASC',
        ...filters
      } = req.query;

      let result;
      let count;

      if (page && limit) {
        // Пагинация с мастерами
        const offset = (parseInt(page) - 1) * parseInt(limit);
        result = await this.repository.findAllWithMaster({
          where: filters,
          order: [[sortBy, sortOrder]],
          limit: parseInt(limit),
          offset
        });
        count = result.count;
      } else {
        // Без пагинации, но с мастерами
        result = await this.repository.findAllWithMaster({
          where: filters,
          order: [[sortBy, sortOrder]]
        });
        count = result.rows ? result.rows.length : result.count;
      }

      const response = {
        success: true,
        data: result.rows || result,
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

  // Переопределяем getAllSorted чтобы включать мастера
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = 'id', sortOrder = 'ASC' } = req.query;
      const result = await this.repository.findAllWithMaster({
        order: [[sortBy, sortOrder]]
      });
      res.json({
        success: true,
        data: result.rows || result,
        count: result.count || (result.rows ? result.rows.length : 0)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем getAllFiltered чтобы включать мастера
  getAllFiltered = async (req, res) => {
    try {
      const where = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          where[key] = req.query[key];
        }
      });

      const result = await this.repository.findAllWithMaster({ where });
      res.json({
        success: true,
        data: result.rows || result,
        count: result.count || (result.rows ? result.rows.length : 0)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем getById чтобы включать мастера
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      const worker = await this.repository.findByIdWithMaster(id);

      if (!worker) {
        return res.status(404).json({
          success: false,
          error: 'Рабочий не найден'
        });
      }

      res.json({
        success: true,
        data: worker
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить всех рабочих с их мастерами (для обратной совместимости)
  getAllWithMaster = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'ASC',
        ...filters
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const result = await this.repository.findAllWithMaster({
        where: filters,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset
      });

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          current: parseInt(page),
          total: result.count,
          pages: Math.ceil(result.count / parseInt(limit)),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить рабочего с мастером по ID (алиас для getById)
  getWithMaster = async (req, res) => {
    return this.getById(req, res);
  };

  // Переопределяем create чтобы возвращать рабочего с мастером
  create = async (req, res) => {
    try {
      const record = await this.repository.create(req.body);
      // Получаем созданного рабочего с мастером
      const workerWithMaster = await this.repository.findByIdWithMaster(record.id);
      
      res.status(201).json({
        success: true,
        data: workerWithMaster || record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем update чтобы возвращать рабочего с мастером
  update = async (req, res) => {
    try {
      const record = await this.repository.update(req.params.id, req.body);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Рабочий не найден'
        });
      }
      
      // Получаем обновленного рабочего с мастером
      const workerWithMaster = await this.repository.findByIdWithMaster(req.params.id);
      
      res.json({
        success: true,
        data: workerWithMaster || record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Переопределяем search чтобы включать мастера
  search = async (req, res) => {
    try {
      const { q, field, operator = 'OR' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      // Определяем поля для поиска
      const fields = field ? [field] : ['last_name', 'first_name', 'middle_name'];

      // Используем поиск через репозиторий, но с включением мастера
      const { Op } = require('sequelize');
      const whereClause = {
        [Op[operator === 'AND' ? 'and' : 'or']]: fields.map(field => ({
          [field]: {
            [Op.iLike]: `%${q}%`
          }
        }))
      };

      const result = await this.repository.findAllWithMaster({
        where: whereClause
      });

      res.json({
        success: true,
        data: result.rows || result,
        count: result.count || (result.rows ? result.rows.length : 0)
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new WorkerController();
