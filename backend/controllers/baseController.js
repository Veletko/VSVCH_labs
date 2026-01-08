const mongoose = require('mongoose');

class BaseController {
  constructor(model) {
    this.model = model;
  }

  // Вспомогательная функция для конвертации ID в ObjectId
  convertToObjectId(value) {
    if (!value) return value;
    if (value instanceof mongoose.Types.ObjectId) return value;
    if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
      return new mongoose.Types.ObjectId(value);
    }
    return value;
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

      // Обрабатываем фильтры
      const filter = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          let value = filters[key];
          // Если поле заканчивается на _id или это _id, конвертируем в ObjectId
          if (key.endsWith('_id') || key === '_id') {
            value = this.convertToObjectId(value);
            if (value !== null && value !== '') {
              filter[key] = value;
            }
          } else {
            filter[key] = value;
          }
        }
      });

      const [records, count] = await Promise.all([
        this.model.find(filter)
          .sort({ [sortBy]: sortDirection })
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
      console.error('Error fetching records:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при получении записей'
      });
    }
  };

  // Получить все записи с сортировкой
  getAllSorted = async (req, res) => {
    try {
      const { sortBy = '_id', sortOrder = 'asc' } = req.query;
      const sortDirection = sortOrder.toLowerCase() === 'desc' ? -1 : 1;

      const records = await this.model.find()
        .sort({ [sortBy]: sortDirection });

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      console.error('Error fetching sorted records:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при получении записей'
      });
    }
  };

  // Получить все записи с фильтрацией
  getAllFiltered = async (req, res) => {
    try {
      const filter = {};
      Object.keys(req.query).forEach(key => {
        if (req.query[key] && req.query[key] !== '') {
          let value = req.query[key];
          // Если поле заканчивается на _id или это _id, конвертируем в ObjectId
          if (key.endsWith('_id') || key === '_id') {
            value = this.convertToObjectId(value);
            if (value !== null && value !== '') {
              filter[key] = value;
            }
          } else {
            filter[key] = value;
          }
        }
      });

      const records = await this.model.find(filter);

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      console.error('Error fetching filtered records:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при получении записей'
      });
    }
  };

  // Поиск записей
  search = async (req, res) => {
    try {
      const { q, field = 'name' } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          error: 'Поисковый запрос обязателен'
        });
      }

      const filter = {
        [field]: { $regex: q, $options: 'i' }
      };

      const records = await this.model.find(filter);

      res.json({
        success: true,
        data: records,
        count: records.length
      });
    } catch (error) {
      console.error('Error searching records:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при поиске записей'
      });
    }
  };

  // Получить запись по ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Валидируем ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const record = await this.model.findById(id);
      
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
      console.error('Error fetching record by ID:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при получении записи'
      });
    }
  };

  // Проверить существование записи
  exists = async (req, res) => {
    try {
      const { id } = req.params;
      
      // Валидируем ID
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const record = await this.model.findById(id);
      res.json({
        success: true,
        exists: !!record
      });
    } catch (error) {
      console.error('Error checking record existence:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при проверке существования записи'
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
      
      // Конвертируем поля с _id в ObjectId (рекурсивно для вложенных объектов)
      const data = { ...req.body };
      const convertIdsInObject = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        Object.keys(obj).forEach(key => {
          if (key.endsWith('_id')) {
            // Конвертируем в ObjectId (функция сама обработает null/пустые значения)
            obj[key] = this.convertToObjectId(obj[key]);
          } else if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            // Рекурсивно обрабатываем вложенные объекты
            convertIdsInObject(obj[key]);
          } else if (Array.isArray(obj[key])) {
            // Обрабатываем массивы
            obj[key] = obj[key].map(item => {
              if (typeof item === 'object' && item !== null) {
                return convertIdsInObject({ ...item });
              }
              return item;
            });
          }
        });
        
        return obj;
      };
      
      convertIdsInObject(data);
      
      // Mongoose автоматически обрабатывает вложенные объекты
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
      console.error('Error deleting record:', error);
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }
      res.status(500).json({
        success: false,
        error: error.message || 'Ошибка при удалении записи'
      });
    }
  };
}

module.exports = BaseController;
