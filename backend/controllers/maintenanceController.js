const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class MaintenanceController extends BaseController {
  constructor() {
    super(RepositoryFactory.getMaintenanceRepository());
  }

  // Получить все записи обслуживания с детальной информацией
  getAllDetailed = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = 'start_date',
        sortOrder = 'DESC',
        ...filters
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const result = await this.repository.findAllDetailed({
        where: filters,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset
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

  // Получить запись обслуживания с детальной информацией по ID
  getDetailed = async (req, res) => {
    try {
      const { id } = req.params;
      const maintenance = await this.repository.findByIdDetailed(id);

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

  // Получить записи по состоянию
  getByState = async (req, res) => {
    try {
      const { state } = req.params;
      const {
        page = 1,
        limit = 10,
        sortBy = 'start_date',
        sortOrder = 'DESC',
        ...filters
      } = req.query;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      const result = await this.repository.findByState(state, {
        where: filters,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset
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
}

module.exports = new MaintenanceController();
