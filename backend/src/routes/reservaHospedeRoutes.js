const express = require('express');
const router = express.Router();
const hospedeController = require('../controllers/reservaHospede')

//hospede routes
router.post('/cadastrarReservaHospede', hospedeController.createOrUpdate);
router.put('/atualizarReservaHospede', hospedeController.createOrUpdate);
router.delete('/apagarReservaHospede/:id', hospedeController.delete);
router.get('/buscarReservaHospede', hospedeController.get);
router.get('/buscarReservaHospede/hotel/:id', hospedeController.getByHotel)
router.get('/buscarReservaHospede/:id', hospedeController.getOne);

module.exports = router;
