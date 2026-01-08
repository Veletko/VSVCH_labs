const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');

// CRUD операции
router.get('/', workshopController.getAll.bind(workshopController));
router.get('/all', workshopController.getAllSorted.bind(workshopController));
router.get('/filtered', workshopController.getAllFiltered.bind(workshopController));
router.get('/search', workshopController.search.bind(workshopController));
router.get('/:id', workshopController.getById.bind(workshopController));
router.get('/:id/exists', workshopController.exists.bind(workshopController));
router.post('/', workshopController.create.bind(workshopController));
router.put('/:id', workshopController.update.bind(workshopController));
router.delete('/:id', workshopController.delete.bind(workshopController));

module.exports = router;
