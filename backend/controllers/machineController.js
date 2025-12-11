const BaseController = require('./baseController');
const { Machine, MaintenanceHistory } = require('../models/associations');

class MachineController extends BaseController {
  constructor() {
    super(Machine);
  }

  // Получить машину с историей обслуживания
  getWithMaintenance = async (req, res) => {
    try {
      const machine = await Machine.findByPk(req.params.id, {
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          include: ['master']
        }]
      });
      
      if (!machine) {
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }
      
      res.json({
        success: true,
        data: machine
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Статистика по машине
  getStatistics = async (req, res) => {
    try {
      const machine = await Machine.findByPk(req.params.id, {
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          attributes: ['id', 'state', 'start_date', 'end_date']
        }]
      });
      
      if (!machine) {
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }
      
      const stats = {
        totalMaintenance: machine.maintenanceHistory.length,
        completedMaintenance: machine.maintenanceHistory.filter(m => m.state === 'completed').length,
        inProgressMaintenance: machine.maintenanceHistory.filter(m => m.state === 'in_progress').length,
        plannedMaintenance: machine.maintenanceHistory.filter(m => m.state === 'planned').length,
        lastMaintenance: machine.maintenanceHistory
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
const machineController = new MachineController();

// Экспортируем методы контроллера
module.exports = {
  getAll: machineController.getAll,
  getAllSorted: machineController.getAllSorted,
  getAllFiltered: machineController.getAllFiltered,
  search: machineController.search,
  getById: machineController.getById,
  exists: machineController.exists,
  create: machineController.create,
  update: machineController.update,
  delete: machineController.delete,
  getWithMaintenance: machineController.getWithMaintenance,
  getStatistics: machineController.getStatistics
};

module.exports = machineController; 