const Machine = require('../models/Machine');
const MaintenanceHistory = require('../models/MaintenanceHistory');
const BaseController = require('./baseController');
const { sequelize } = require('../config/database'); // Добавьте этот импорт

class MachineController extends BaseController {
  constructor() {
    super(Machine);
  }

  // Метод для получения машины с записями обслуживания
  getWithMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      
      const machine = await this.model.findByPk(id, {
        include: [{
          model: MaintenanceHistory,
          as: 'maintenanceHistory',
          include: ['master'] // если нужно включить мастера
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
      console.error('Error getting machine with maintenance:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Основной метод удаления с транзакцией
  delete = async (req, res) => {
    const transaction = await sequelize.transaction(); // Начинаем транзакцию
    
    try {
      const { id } = req.params;

      // 1. Сначала удаляем все связанные записи обслуживания
      await MaintenanceHistory.destroy({
        where: { machine_id: id },
        transaction // передаем транзакцию
      });

      // 2. Затем удаляем саму машину
      const deleted = await this.model.destroy({
        where: { id },
        transaction // передаем транзакцию
      });

      if (!deleted) {
        await transaction.rollback(); // откатываем транзакцию
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }

      // 3. Подтверждаем транзакцию
      await transaction.commit();

      res.json({
        success: true,
        message: 'Машина и связанные записи обслуживания успешно удалены'
      });
    } catch (error) {
      // Откатываем транзакцию при ошибке
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      
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
      const maintenanceCount = await MaintenanceHistory.count({
        where: { machine_id: id }
      });

      if (maintenanceCount > 0) {
        return res.status(400).json({
          success: false,
          error: `Невозможно удалить машину. Существует ${maintenanceCount} записей обслуживания, связанных с этой машиной. Используйте обычный DELETE метод для удаления с зависимостями.`
        });
      }
      
      // Если зависимостей нет, удаляем
      const deleted = await this.model.destroy({
        where: { id }
      });

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