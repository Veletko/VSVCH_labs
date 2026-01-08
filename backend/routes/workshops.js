// routes/workshops.js
const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');
const { authMiddleware } = require('../middleware/auth');

// Все маршруты требуют авторизации
router.use(authMiddleware);

// Получить все цеха
router.get('/', workshopController.getAll);

// Получить цех по ID
router.get('/:id', workshopController.getById);

// Создать новый цех
router.post('/', workshopController.create);

// Обновить цех
router.put('/:id', workshopController.update);

// Сохранить схему цеха
router.post('/:id/layout', workshopController.saveLayout);

// Удалить цех
router.delete('/:id', workshopController.delete);

module.exports = router;
