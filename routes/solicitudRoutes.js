const express = require('express');
const router = express.Router();

const {
  listarSolicitudes,
  crearSolicitud
} = require('../controllers/solicitudController');

router.get('/solicitudes', listarSolicitudes);
router.post('/solicitudes', crearSolicitud);

module.exports = router;
