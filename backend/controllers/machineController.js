const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class MachineController extends BaseController {
  constructor() {
    super(RepositoryFactory.getMachineRepository());
  }

  // Получить машину с историей обслуживания
  getWithMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      const machine = await this.repository.findByIdWithMaintenance(id);

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

  // Получить статистику по машине
  getStatistics = async (req, res) => {
    try {
      const { id } = req.params;
      const statistics = await this.repository.getStatistics(id);

      if (!statistics) {
        return res.status(404).json({
          success: false,
          error: 'Машина не найдена'
        });
      }

      res.json({
        success: true,
        data: statistics
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Удалить машину (с удалением связанных записей обслуживания)
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Используем транзакцию через адаптер БД
      const { dbAdapter } = require('../config/database');
      
      let deleted = false;
      
      await dbAdapter.transaction(async (transaction) => {
        // Удаляем машину вместе с зависимостями
        deleted = await this.repository.deleteWithDependencies(id, transaction);
        
        if (!deleted) {
          throw new Error('Машина не найдена');
        }
      });

      res.json({
        success: true,
        message: 'Машина и связанные записи обслуживания успешно удалены'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new MachineController();
