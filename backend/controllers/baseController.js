const { Op } = require('sequelize');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Получить все записи
  getAll = async (req, res) => {
    try {
      const records = await this.model.findAll();
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

  // Получить все записи с сортировкой
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = 'id', sortOrder = 'ASC' } = req.query;
      const records = await this.model.findAll({
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

      const records = await this.model.findAll({ where });
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
      const { q, field = 'name' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      const records = await this.model.findAll({
        where: {
          [field]: {
            [Op.like]: `%${q}%`
          }
        }
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

  // Получить запись по ID
  getById = async (req, res) => {
    try {
      const record = await this.model.findByPk(req.params.id);
      
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
      const record = await this.model.findByPk(req.params.id);
      res.json({
        success: true,
        exists: !!record
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
      const record = await this.model.create(req.body);
      
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
      const record = await this.model.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      await record.update(req.body);
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
      const record = await this.model.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      await record.destroy();
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