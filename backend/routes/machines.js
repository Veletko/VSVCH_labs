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
router.get('/:id/statistics', machineController.getStatistics);
router.post('/', machineController.create);
router.put('/:id', machineController.update);
router.delete('/:id', machineController.delete);

module.exports = router;