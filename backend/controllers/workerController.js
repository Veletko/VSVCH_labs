// controllers/workerController.js
const BaseController = require('./baseController');
const Worker = require('../models/Worker');
const Master = require('../models/Master');

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
        sortBy = '_id',
        sortOrder = 'asc',
        ...filters
      } = req.query;

      const offset = (page - 1) * limit;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const filter = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          filter[key] = filters[key];
        }
      });

      const [records, count] = await Promise.all([
        Worker.find(filter)
          .populate({
            path: 'master_id',
            select: '_id last_name first_name middle_name'
          })
          .sort({ [sortBy]: sortDirection })
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        Worker.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: records,
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
      const { sortBy = '_id', sortOrder = 'asc' } = req.query;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const records = await Worker.find()
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
        })
        .sort({ [sortBy]: sortDirection });
      
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
      const filter = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          filter[key] = req.query[key];
        }
      });

      const records = await Worker.find(filter)
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
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

      const records = await Worker.find({
        [field]: { $regex: q, $options: 'i' }
      }).populate({
        path: 'master_id',
        select: '_id last_name first_name middle_name'
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
      const record = await Worker.findById(req.params.id)
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
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
      const worker = await Worker.findById(req.params.id)
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
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
      const records = await Worker.find()
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
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
}

// Создаем экземпляр контроллера
const workerController = new WorkerController();

// Экспортируем все методы контроллера
module.exports = workerController;