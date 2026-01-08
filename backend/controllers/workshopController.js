// controllers/workshopController.js
const Workshop = require('../models/Workshop');
const mongoose = require('mongoose');

class WorkshopController {
  // Получить все цеха
  getAll = async (req, res) => {
    try {
      const workshops = await Workshop.find().populate('elements.machine_id', '_id status');
      
      res.json({
        success: true,
        data: workshops
      });
    } catch (error) {
      console.error('Error fetching workshops:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Получить цех по ID
  getById = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const workshop = await Workshop.findById(id).populate('elements.machine_id', '_id status');
      
      if (!workshop) {
        return res.status(404).json({
          success: false,
          error: 'Цех не найден'
        });
      }
      
      res.json({
        success: true,
        data: workshop
      });
    } catch (error) {
      console.error('Error fetching workshop:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };

  // Создать новый цех
  create = async (req, res) => {
    try {
      const { name, description, canvasWidth, canvasHeight } = req.body;
      
      // Проверяем, не существует ли уже цех с таким именем
      const existingWorkshop = await Workshop.findOne({ name });
      if (existingWorkshop) {
        return res.status(400).json({
          success: false,
          error: 'Цех с таким названием уже существует'
        });
      }

      const workshop = await Workshop.create({
        name,
        description,
        elements: [],
        canvasWidth: canvasWidth || 1200,
        canvasHeight: canvasHeight || 800
      });
      
      res.status(201).json({
        success: true,
        data: workshop
      });
    } catch (error) {
      console.error('Error creating workshop:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Обновить цех
  update = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const data = { ...req.body };
      
      // Конвертируем machine_id в ObjectId для элементов
      if (data.elements && Array.isArray(data.elements)) {
        data.elements = data.elements.map(element => {
          if (element.machine_id) {
            if (typeof element.machine_id === 'string' && mongoose.Types.ObjectId.isValid(element.machine_id)) {
              element.machine_id = new mongoose.Types.ObjectId(element.machine_id);
            } else if (!element.machine_id) {
              element.machine_id = null;
            }
          }
          return element;
        });
      }

      const workshop = await Workshop.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
      ).populate('elements.machine_id', '_id status');
      
      if (!workshop) {
        return res.status(404).json({
          success: false,
          error: 'Цех не найден'
        });
      }
      
      res.json({
        success: true,
        data: workshop
      });
    } catch (error) {
      console.error('Error updating workshop:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Сохранить схему цеха (обновить только элементы)
  saveLayout = async (req, res) => {
    try {
      const { id } = req.params;
      const { elements, canvasWidth, canvasHeight } = req.body;
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const updateData = {};
      if (elements !== undefined) {
        // Конвертируем machine_id в ObjectId
        updateData.elements = elements.map(element => {
          const newElement = { ...element };
          if (newElement.machine_id) {
            if (typeof newElement.machine_id === 'string' && mongoose.Types.ObjectId.isValid(newElement.machine_id)) {
              newElement.machine_id = new mongoose.Types.ObjectId(newElement.machine_id);
            } else if (!newElement.machine_id) {
              newElement.machine_id = null;
            }
          }
          return newElement;
        });
      }
      if (canvasWidth !== undefined) updateData.canvasWidth = canvasWidth;
      if (canvasHeight !== undefined) updateData.canvasHeight = canvasHeight;

      const workshop = await Workshop.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).populate('elements.machine_id', '_id status');
      
      if (!workshop) {
        return res.status(404).json({
          success: false,
          error: 'Цех не найден'
        });
      }
      
      res.json({
        success: true,
        data: workshop
      });
    } catch (error) {
      console.error('Error saving workshop layout:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  };

  // Удалить цех
  delete = async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          error: 'Неверный формат ID'
        });
      }

      const workshop = await Workshop.findByIdAndDelete(id);
      
      if (!workshop) {
        return res.status(404).json({
          success: false,
          error: 'Цех не найден'
        });
      }
      
      res.json({
        success: true,
        message: 'Цех успешно удален'
      });
    } catch (error) {
      console.error('Error deleting workshop:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  };
}

module.exports = new WorkshopController();
