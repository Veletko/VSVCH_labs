const BaseController = require('./baseController');
const { MaintenanceHistory, Machine, Master } = require('../models/associations');
const { Op } = require('sequelize');

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
        sortBy = 'id',
        sortOrder = 'ASC',
        ...filters
      } = req.query;

      const where = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          where[key] = filters[key];
        }
      });

      const offset = (page - 1) * limit;

      const { count, rows } = await MaintenanceHistory.findAndCountAll({
        where,
        include: [
          {
            model: Machine,
            as: 'machine',
            attributes: ['id']
          },
          {
            model: Master,
            as: 'master',
            attributes: ['id', 'last_name', 'first_name', 'middle_name']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

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

  // Получить запись обслуживания с детальной информацией
  getDetailed = async (req, res) => {
    try {
      const maintenance = await MaintenanceHistory.findByPk(req.params.id, {
        include: [
          {
            model: Machine,
            as: 'machine',
            attributes: ['id']
          },
          {
            model: Master,
            as: 'master',
            attributes: ['id', 'last_name', 'first_name', 'middle_name']
          }
        ]
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

      const { count, rows } = await MaintenanceHistory.findAndCountAll({
        where: { state },
        include: [
          {
            model: Machine,
            as: 'machine'
          },
          {
            model: Master,
            as: 'master',
            attributes: ['id', 'last_name', 'first_name', 'middle_name']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      res.json({
        success: true,
        data: rows,
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