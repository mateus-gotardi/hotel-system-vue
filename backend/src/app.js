const express = require('express');
const app = express();
const cors = require('cors');
const index = require('./routes/index');
const hotel = require('./routes/hotelRoutes');
const reservaHospede = require('./routes/reservaHospedeRoutes');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/', index);
app.use('/', hotel);
app.use('/', reservaHospede);
module.exports = app;
