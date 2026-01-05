const express = require('express');
const router = express.Router();
const machineController = require('../controllers/machineController');

// CRUD операции
router.get('/', machineController.getAll);
router.get('/all', machineController.getAllSorted);
router.get('/filtered', machineController.getAllFiltered);
router.get('/search', machineController.search);
router.get('/:id', machineController.getById);
router.get('/:id/exists', machineController.exists);
router.get('/:id/with-maintenance', machineController.getWithMaintenance);
router.post('/', machineController.create);
router.put('/:id', machineController.update);

// Удаление с зависимостями (основной метод)
router.delete('/:id', machineController.delete);

// Альтернативный метод - безопасное удаление (только если нет зависимостей)
router.delete('/:id/safe', machineController.safeDelete);

module.exports = router;