// controllers/maintenanceController.js
const BaseController = require('./baseController');
const MaintenanceHistory = require('../models/MaintenanceHistory');
const Machine = require('../models/Machine');
const Master = require('../models/Master');

class MaintenanceController extends BaseController {
  constructor() {
    super(MaintenanceHistory);
  }

  // Получить все записи обслуживания с информацией о машине и мастере
  getAllDetailed = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = '_id',
        sortOrder = 'asc',
        ...filters
      } = req.query;

      const filter = {};
      const mongoose = require('mongoose');
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          let value = filters[key];
          // Если поле заканчивается на _id, конвертируем в ObjectId
          if (key.endsWith('_id') || key === '_id') {
            if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
              value = new mongoose.Types.ObjectId(value);
            }
          }
          filter[key] = value;
        }
      });

      const offset = (page - 1) * limit;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const [records, count] = await Promise.all([
        MaintenanceHistory.find(filter)
          .populate({
            path: 'machine_id',
            select: '_id status'
          })
          .populate({
            path: 'master_id',
            select: '_id last_name first_name middle_name'
          })
          .sort({ [sortBy]: sortDirection })
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        MaintenanceHistory.countDocuments(filter)
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

  // Получить запись обслуживания с детальной информацией
  getDetailed = async (req, res) => {
    try {
      // Валидируем ID
      const mongoose = require('mongoose');
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
      const maintenance = await MaintenanceHistory.findById(req.params.id)
        .populate({
          path: 'machine_id',
          select: '_id status'
        })
        .populate({
          path: 'master_id',
          select: '_id last_name first_name middle_name'
        });
      
      if (!maintenance) {
        return res.status(404).json({
          success: false,
          error: 'Запись обслуживания не найдена'
        });
      }
      
      res.json({
        success: true,
        data: maintenance
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить обслуживание по статусу
  getByState = async (req, res) => {
    try {
      const { state } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const offset = (page - 1) * limit;

      const [records, count] = await Promise.all([
        MaintenanceHistory.find({ state })
          .populate({
            path: 'machine_id',
            select: '_id status'
          })
          .populate({
            path: 'master_id',
            select: '_id last_name first_name middle_name'
          })
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        MaintenanceHistory.countDocuments({ state })
      ]);

      res.json({
        success: true,
        data: records,
        state,
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
}

// Создаем экземпляр контроллера
const maintenanceController = new MaintenanceController();

// Экспортируем экземпляр контроллера целиком
module.exports = maintenanceController;