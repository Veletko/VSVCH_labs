const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');

// CRUD операции
router.get('/', workerController.getAll); // Теперь поддерживает includeMaster параметр
router.get('/all', workerController.getAllSorted);
router.get('/filtered', workerController.getAllFiltered);
router.get('/search', workerController.search);
router.get('/:id', workerController.getById);
router.get('/:id/exists', workerController.exists);
router.get('/:id/with-master', workerController.getWithMaster);

// Специальный маршрут для получения всех рабочих с мастерами
router.get('/with-master/all', workerController.getAllWithMaster);

router.post('/', workerController.create);
router.put('/:id', workerController.update);
router.delete('/:id', workerController.delete);

module.exports = router;