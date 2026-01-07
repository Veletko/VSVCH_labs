// controllers/masterController.js
const mongoose = require('mongoose');
const BaseController = require('./baseController');
const Master = require('../models/Master');

class MasterController extends BaseController {
  constructor() {
    super(Master);
  }

  // Получить всех мастеров с их обслуживаниями
  getAllWithMaintenance = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'id',
        sortOrder = 'asc'
      } = req.query;

      const offset = (page - 1) * limit;
      const mongoSortBy = sortBy === 'id' ? '_id' : sortBy;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const [records, count] = await Promise.all([
        Master.find()
          .populate({
            path: 'maintenance_history',
            populate: {
              path: 'machine_id',
              select: '_id status'
            }
          })
          .populate('workers')
          .sort({ [mongoSortBy]: sortDirection })
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        Master.countDocuments()
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

  // Получить мастера с его обслуживаниями
  getWithMaintenance = async (req, res) => {
    try {
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
      const master = await Master.findById(req.params.id)
        .populate({
          path: 'maintenance_history',
          populate: {
            path: 'machine_id',
            select: '_id status'
          }
        })
        .populate('workers');
      
      if (!master) {
        return res.status(404).json({
          success: false,
          error: 'Мастер не найден'
        });
      }
      
      res.json({
        success: true,
        data: master
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

  // Переопределяем update для правильной обработки пароля
  update = async (req, res) => {
    try {
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
      const data = { ...req.body };
      
      // Если password_hash не передан или пустой, удаляем его из обновления
      // чтобы не нарушать валидацию required
      if (!data.password_hash || data.password_hash === '') {
        delete data.password_hash;
      }
      
      // Конвертируем is_active из строки в boolean если нужно
      if (data.is_active !== undefined) {
        if (typeof data.is_active === 'string') {
          data.is_active = data.is_active === 'true';
        }
      }
      
      // Конвертируем поля с _id в ObjectId
      Object.keys(data).forEach(key => {
        if (key.endsWith('_id')) {
          // Используем метод из BaseController
          data[key] = this.convertToObjectId(data[key]);
        }
      });
      
      const record = await Master.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true, runValidators: true }
      );
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Мастер не найден'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      console.error('Error updating master:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Статистика по мастеру
  getStatistics = async (req, res) => {
    try {
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
      const master = await Master.findById(req.params.id)
        .populate({
          path: 'maintenance_history',
          select: 'state start_date end_date'
        });
      
      if (!master) {
        return res.status(404).json({
          success: false,
          error: 'Мастер не найден'
        });
      }
      
      const stats = {
        totalMaintenance: master.maintenance_history.length,
        completedMaintenance: master.maintenance_history.filter(m => m.state === 'completed').length,
        inProgressMaintenance: master.maintenance_history.filter(m => m.state === 'in_progress').length,
        plannedMaintenance: master.maintenance_history.filter(m => m.state === 'planned').length,
        lastMaintenance: master.maintenance_history
          .filter(m => m.state === 'completed')
          .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0] || null
      };
      
      res.json({
        success: true,
        data: stats
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
}

// Создаем экземпляр контроллера
const masterController = new MasterController();

// Экспортируем все методы контроллера
module.exports = masterController;