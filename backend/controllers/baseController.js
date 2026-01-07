// controllers/baseController.js
class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Получить все записи
   getAll = async (req, res) => {
    try {
      const records = await this.model.find();
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с сортировкой
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = 'id', sortOrder = 'asc' } = req.query;
      // Преобразуем 'id' в '_id' для MongoDB
      const mongoSortBy = sortBy === 'id' ? '_id' : sortBy;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;
      
      const records = await this.model.find().sort({ [mongoSortBy]: sortDirection });
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить все записи с фильтрацией
  getAllFiltered = async (req, res) => {
    try {
      const where = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          // Преобразуем 'id' в '_id' для MongoDB
          const mongoKey = key === 'id' ? '_id' : key;
          where[mongoKey] = req.query[key];
        }
      });

      const records = await this.model.find(where);
      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Поиск записей
  search = async (req, res) => {
    try {
      const { q, field = 'last_name' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      // Преобразуем 'id' в '_id' для MongoDB
      const mongoField = field === 'id' ? '_id' : field;
      
      const records = await this.model.find({
        [mongoField]: { $regex: q, $options: 'i' }
      });

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить запись по ID
  getById = async (req, res) => {
    try {
      const record = await this.model.findById(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        data: record
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

  // Проверить существование записи
  exists = async (req, res) => {
    try {
      const record = await this.model.findById(req.params.id);
      res.json({
        success: true,
        exists: !!record
      });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.json({
          success: true,
          exists: false
        });
      }
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Создать новую запись
  create = async (req, res) => {
    try {
      const record = await this.model.create(req.body);
      
      // transformId middleware преобразует _id в id
      res.status(201).json({
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

  // Обновить запись
  update = async (req, res) => {
    try {
      const record = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      // transformId middleware преобразует _id в id
      res.json({
        success: true,
        data: record
      });
    } catch (error) {
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

  // Удалить запись
  delete = async (req, res) => {
    try {
      const record = await this.model.findByIdAndDelete(req.params.id);
      
      if (!record) {
        return res.status(404).json({
          success: false,
          error: 'Запись не найдена'
        });
      }
      
      res.json({
        success: true,
        message: 'Запись успешно удалена'
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

module.exports = BaseController;