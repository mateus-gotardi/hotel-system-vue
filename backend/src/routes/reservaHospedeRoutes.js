const express = require('express');
const router = express.Router();
const hospedeController = require('../controllers/reservaHospede')

//hospede routes
router.post('/cadastrarReservaHospede', hospedeController.post);
router.put('/atualizarReservaHospede:id', hospedeController.put);
router.delete('/apagarReservaHospede:id', hospedeController.delete);
router.get('/buscarReservaHospede', hospedeController.get);
router.get('/buscarReservaHospede:id', hospedeController.getOne);

module.exports = router;
