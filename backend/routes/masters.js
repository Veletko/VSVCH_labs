const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

// Публичные маршруты (доступны без аутентификации) - только GET
router.get('/', masterController.getAll);
router.get('/all', masterController.getAllSorted);
router.get('/filtered', masterController.getAllFiltered);
router.get('/search', masterController.search);
router.get('/:id', masterController.getById);
router.get('/:id/exists', masterController.exists);
router.get('/:id/with-maintenance', masterController.getWithMaintenance);
router.get('/:id/statistics', masterController.getStatistics);
router.get('/with-maintenance/all', masterController.getAllWithMaintenance);

// Защищенные маршруты (требуют аутентификации)
router.post('/', authMiddleware, masterController.create);
router.put('/:id', authMiddleware, masterController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), masterController.delete);

module.exports = router;