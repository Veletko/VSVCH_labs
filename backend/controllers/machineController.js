// controllers/machineController.js
const Machine = require('../models/Machine');
const MaintenanceHistory = require('../models/MaintenanceHistory');
const BaseController = require('./baseController');

class MachineController extends BaseController {
  constructor() {
    super(Machine);
  }

  // Метод для получения машины с записями обслуживания
  getWithMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      
      const machine = await Machine.findById(id).populate({
        path: 'maintenance_history',
        populate: {
          path: 'master_id',
          select: '_id last_name first_name middle_name'
        }
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
      console.error('Error getting machine with maintenance:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Основной метод удаления
  delete = async (req, res) => {
    const session = await Machine.startSession();
    
    try {
      session.startTransaction();
      const { id } = req.params;

      // 1. Сначала удаляем все связанные записи обслуживания
      await MaintenanceHistory.deleteMany({ machine_id: id }, { session });

      // 2. Затем удаляем саму машину
      const deleted = await Machine.findByIdAndDelete(id, { session });

      if (!deleted) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }

      // 3. Подтверждаем транзакцию
      await session.commitTransaction();
      session.endSession();

      res.json({
        success: true,
        message: 'Машина и связанные записи обслуживания успешно удалены'
      });
    } catch (error) {
      // Откатываем транзакцию при ошибке
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      
      console.error('Error deleting machine:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Альтернативный метод - удаление с проверкой зависимостей
  safeDelete = async (req, res) => {
    try {
      const { id } = req.params;

      // Проверяем, есть ли связанные записи обслуживания
      const maintenanceCount = await MaintenanceHistory.countDocuments({
        machine_id: id
      });

      if (maintenanceCount > 0) {
        return res.status(400).json({
          success: false,
          error: `Невозможно удалить машину. Существует ${maintenanceCount} записей обслуживания, связанных с этой машиной. Используйте обычный DELETE метод для удаления с зависимостями.`
        });
      }
      
      // Если зависимостей нет, удаляем
      const deleted = await Machine.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }

      res.json({
        success: true,
        message: 'Машина успешно удалена'
      });
    } catch (error) {
      console.error('Error deleting machine:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new MachineController();