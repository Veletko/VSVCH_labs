// controllers/baseController.js
const mongoose = require('mongoose');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Вспомогательная функция для конвертации ID в ObjectId
  convertToObjectId(value) {
    // Если значение null, пустая строка или undefined - возвращаем null
    if (!value || value === '' || value === 'null' || value === null) return null;
    // Если это уже ObjectId, возвращаем как есть
    if (value instanceof mongoose.Types.ObjectId) return value;
    // Если это валидная строка ObjectId, конвертируем
    if (typeof value === 'string' && value.trim() !== '' && mongoose.Types.ObjectId.isValid(value)) {
      return new mongoose.Types.ObjectId(value);
    }
    // Иначе возвращаем null (невалидное значение)
    return null;
  }

  // Получить все записи
   getAll = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 1000,
        sortBy = '_id',
        sortOrder = 'asc',
        ...filters
      } = req.query;

      const offset = (page - 1) * limit;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const filter = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          let value = filters[key];
          // Если поле заканчивается на _id, конвертируем в ObjectId
          if (key.endsWith('_id') || key === '_id' || key === 'id') {
            value = this.convertToObjectId(value);
          }
          const mongoKey = key === 'id' ? '_id' : key;
          filter[mongoKey] = value;
        }
      });

      const [records, count] = await Promise.all([
        this.model.find(filter)
          .sort({ [sortBy === 'id' ? '_id' : sortBy]: sortDirection })
          .skip(parseInt(offset))
          .limit(parseInt(limit)),
        this.model.countDocuments(filter)
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
          let value = req.query[key];
          
          // Если поле заканчивается на _id, конвертируем в ObjectId
          if (mongoKey.endsWith('_id') || mongoKey === '_id') {
            value = this.convertToObjectId(value);
          }
          
          where[mongoKey] = value;
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
      // Валидируем и конвертируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
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
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.json({
          success: true,
          exists: false
        });
      }
      
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
    let data = {};
    try {
      // Конвертируем поля с _id в ObjectId
      data = { ...req.body };
      Object.keys(data).forEach(key => {
        if (key.endsWith('_id')) {
          // Конвертируем в ObjectId (функция сама обработает null/пустые значения)
          data[key] = this.convertToObjectId(data[key]);
        }
      });
      
      const record = await this.model.create(data);
      
      res.status(201).json({
        success: true,
        data: record
      });
    } catch (error) {
      console.error('Error creating record:', error);
      console.error('Request body:', req.body);
      console.error('Processed data:', data);
      res.status(400).json({
        success: false,
        error: error.message || 'Ошибка при создании записи'
      });
    }
  };

  // Обновить запись
  update = async (req, res) => {
    try {
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
      // Конвертируем поля с _id в ObjectId
      const data = { ...req.body };
      Object.keys(data).forEach(key => {
        if (key.endsWith('_id')) {
          // Конвертируем в ObjectId (функция сама обработает null/пустые значения)
          data[key] = this.convertToObjectId(data[key]);
        }
      });
      
      const record = await this.model.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true, runValidators: true }
      );
      
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
      console.error('Error updating record:', error);
      console.error('Request params:', req.params);
      console.error('Request body:', req.body);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      res.status(400).json({
        success: false,
        error: error.message || 'Ошибка при обновлении записи'
      });
    }
  };

  // Удалить запись
  delete = async (req, res) => {
    try {
      // Валидируем ID
      if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      
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