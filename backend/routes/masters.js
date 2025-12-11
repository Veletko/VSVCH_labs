const express = require('express');
const router = express.Router();
const masterController = require('../controllers/masterController');

// CRUD операции
router.get('/', masterController.getAll);
router.get('/all', masterController.getAllSorted);
router.get('/filtered', masterController.getAllFiltered);
router.get('/search', masterController.search);
router.get('/:id', masterController.getById);
router.get('/:id/exists', masterController.exists);
router.get('/:id/with-maintenance', masterController.getWithMaintenance);
router.get('/:id/statistics', masterController.getStatistics);
router.get('/with-maintenance/all', masterController.getAllWithMaintenance);
router.post('/', masterController.create);
router.put('/:id', masterController.update);
router.delete('/:id', masterController.delete);

module.exports = router;