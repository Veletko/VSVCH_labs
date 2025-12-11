const BaseController = require('./baseController');
const { Master, MaintenanceHistory, Machine } = require('../models/associations');

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
        sortOrder = 'ASC'
      } = req.query;

      const offset = (page - 1) * limit;

      const { count, rows } = await Master.findAndCountAll({
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          include: [{
            model: Machine,
            as: 'machine'
          }]
        }],
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

  // Получить мастера с его обслуживаниями
  getWithMaintenance = async (req, res) => {
    try {
      const master = await Master.findByPk(req.params.id, {
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          include: [{
            model: Machine,
            as: 'machine'
          }]
        }]
      });
      
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
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Статистика по мастеру
  getStatistics = async (req, res) => {
    try {
      const master = await Master.findByPk(req.params.id, {
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          attributes: ['id', 'state', 'start_date', 'end_date']
        }]
      });
      
      if (!master) {
        return res.status(404).json({
          success: false,
          error: 'Мастер не найден'
        });
      }
      
      const stats = {
        totalMaintenance: master.maintenanceHistory.length,
        completedMaintenance: master.maintenanceHistory.filter(m => m.state === 'completed').length,
        inProgressMaintenance: master.maintenanceHistory.filter(m => m.state === 'in_progress').length,
        plannedMaintenance: master.maintenanceHistory.filter(m => m.state === 'planned').length,
        lastMaintenance: master.maintenanceHistory
          .filter(m => m.state === 'completed')
          .sort((a, b) => new Date(b.end_date) - new Date(a.end_date))[0] || null
      };
      
      res.json({
        success: true,
        data: stats
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
const masterController = new MasterController();

// Экспортируем методы контроллера
module.exports = {
  getAll: masterController.getAll,
  getAllSorted: masterController.getAllSorted,
  getAllFiltered: masterController.getAllFiltered,
  search: masterController.search,
  getById: masterController.getById,
  exists: masterController.exists,
  create: masterController.create,
  update: masterController.update,
  delete: masterController.delete,
  getAllWithMaintenance: masterController.getAllWithMaintenance,
  getWithMaintenance: masterController.getWithMaintenance,
  getStatistics: masterController.getStatistics
};

module.exports = masterController;