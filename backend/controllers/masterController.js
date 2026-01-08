const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class MasterController extends BaseController {
  constructor() {
    super(RepositoryFactory.getMasterRepository());
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

      const result = await this.repository.findAllWithMaintenance({
        page: parseInt(page),
        limit: parseInt(limit),
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        data: result.rows,
        pagination: {
          current: parseInt(page),
          total: result.count,
          pages: Math.ceil(result.count / parseInt(limit)),
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

  // Получить мастера с обслуживанием по ID
  getWithMaintenance = async (req, res) => {
    try {
      const { id } = req.params;
      const master = await this.repository.findByIdWithMaintenance(id);

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

  // Получить статистику по мастеру
  getStatistics = async (req, res) => {
    try {
      const { id } = req.params;
      const statistics = await this.repository.getStatistics(id);

      if (!statistics) {
        return res.status(404).json({
          success: false,
          error: 'Мастер не найден'
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
}

module.exports = new MasterController();
