const BaseController = require('./baseController');
const RepositoryFactory = require('../db/factories/RepositoryFactory');

class WorkshopController extends BaseController {
  constructor() {
    super(RepositoryFactory.getWorkshopRepository());
  }

  // Переопределяем getAll чтобы сортировать по дате создания
  getAll = async (req, res) => {
    try {
      const {
        page,
        limit,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        ...filters
      } = req.query;

      let records;
      let count;

      if (page && limit) {
        // Пагинация
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const result = await this.repository.findAndCountAll({
          where: filters,
          order: [[sortBy, sortOrder]],
          limit: parseInt(limit),
          offset
        });
        records = result.rows;
        count = result.count;
      } else {
        // Без пагинации
        records = await this.repository.findAll({
          where: filters,
          order: [[sortBy, sortOrder]]
        });
        count = records.length;
      }

      const response = {
        success: true,
        data: records,
        count
      };

      if (page && limit) {
        response.pagination = {
          current: parseInt(page),
          total: count,
          pages: Math.ceil(count / parseInt(limit)),
          limit: parseInt(limit)
        };
      }

      res.json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Обновить схему цеха
  update = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, layout_data } = req.body;

      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (layout_data !== undefined) updateData.layout_data = layout_data;

      const record = await this.repository.update(id, updateData);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Схема цеха не найдена'
        });
      }
      
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new WorkshopController();
