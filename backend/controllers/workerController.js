const BaseController = require('./baseController');
const { Worker, Master } = require('../models/associations');
const { Op } = require('sequelize');

class WorkerController extends BaseController {
  constructor() {
    super(Worker);
  }

  // Получить все записи - ВСЕГДА с информацией о мастере
  getAll = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'ASC',
        ...filters
      } = req.query;

      const offset = (page - 1) * limit;

      const options = {
        where: {},
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      };

      // Применяем фильтры
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          options.where[key] = filters[key];
        }
      });

      const { count, rows } = await Worker.findAndCountAll(options);

      res.json({
        success: true,
        data: rows,
        pagination: {
          current: parseInt(page),
          total: count,
          pages: Math.ceil(count / limit),
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

  // Получить все записи с сортировкой - ВСЕГДА с информацией о мастере
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = 'id', sortOrder = 'ASC' } = req.query;

      const records = await Worker.findAll({
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }],
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

  // Получить все записи с фильтрацией - ВСЕГДА с информацией о мастере
  getAllFiltered = async (req, res) => {
    try {
      const where = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          where[key] = req.query[key];
        }
      });

      const records = await Worker.findAll({ 
        where,
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }]
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

  // Поиск записей - ВСЕГДА с информацией о мастере
  search = async (req, res) => {
    try {
      const { q, field = 'last_name' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      const records = await Worker.findAll({
        where: {
          [field]: {
            [Op.like]: `%${q}%`
          }
        },
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }]
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

  // Получить запись по ID - ВСЕГДА с информацией о мастере
  getById = async (req, res) => {
    try {
      const record = await Worker.findByPk(req.params.id, {
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }]
      });
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Рабочий не найден'
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

  // Получить рабочего с информацией о мастере (специальный метод)
  getWithMaster = async (req, res) => {
    try {
      const worker = await Worker.findByPk(req.params.id, {
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }]
      });
      
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

  // Получить всех рабочих с мастерами (дополнительный метод)
  getAllWithMaster = async (req, res) => {
    try {
      const records = await Worker.findAll({
        include: [{
          model: Master,
          as: 'master',
          attributes: ['id', 'last_name', 'first_name', 'middle_name']
        }]
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

  // Создать новую запись
  create = async (req, res) => {
    try {
      const record = await Worker.create(req.body);
      
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
      const record = await Worker.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Рабочий не найден'
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
      const record = await Worker.findByPk(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Рабочий не найден'
        });
      }
      
      await record.destroy();
      res.json({
        success: true,
        message: 'Рабочий успешно удален'
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
      const record = await Worker.findByPk(req.params.id);
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
}

// Создаем экземпляр контроллера
const workerController = new WorkerController();

// Экспортируем методы контроллера
module.exports = {
  getAll: workerController.getAll,
  getAllSorted: workerController.getAllSorted,
  getAllFiltered: workerController.getAllFiltered,
  search: workerController.search,
  getById: workerController.getById,
  exists: workerController.exists,
  create: workerController.create,
  update: workerController.update,
  delete: workerController.delete,
  getWithMaster: workerController.getWithMaster,
  getAllWithMaster: workerController.getAllWithMaster
};