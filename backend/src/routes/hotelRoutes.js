const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel')

//hotel routes
router.post('/cadastrarHotel', hotelController.post);
router.put('/atualizarHotel', hotelController.put);
router.delete('/apagarHotel/:id', hotelController.delete);
router.get('/buscarHotel', hotelController.get);
router.get('/buscarHotel/:id', hotelController.getOne);

module.exports = router;