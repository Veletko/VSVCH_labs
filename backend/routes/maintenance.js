const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

// CRUD операции
router.get('/', maintenanceController.getAll);
router.get('/all', maintenanceController.getAllSorted);
router.get('/filtered', maintenanceController.getAllFiltered);
router.get('/search', maintenanceController.search);
router.get('/:id', maintenanceController.getById);
router.get('/:id/exists', maintenanceController.exists);

// Специальные маршруты для детальной информации
router.get('/detailed/all', maintenanceController.getAllDetailed);
router.get('/:id/detailed', maintenanceController.getDetailed);
router.get('/state/:state', maintenanceController.getByState);

router.post('/', maintenanceController.create);
router.put('/:id', maintenanceController.update);
router.delete('/:id', maintenanceController.delete);

module.exports = router;