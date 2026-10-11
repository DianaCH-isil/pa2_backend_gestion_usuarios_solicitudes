const express = require('express');
const router = express.Router();

const {
  listarSolicitudes,
  crearSolicitud,
  obtenerSolicitudPorId,
  actualizarSolicitud,
  eliminarSolicitud
} = require('../controllers/solicitudController');

router.get('/solicitudes', listarSolicitudes);
router.post('/solicitudes', crearSolicitud);
router.get('/solicitudes/:id', obtenerSolicitudPorId);
router.patch('/solicitudes/:id', actualizarSolicitud);
router.delete('/solicitudes/:id', eliminarSolicitud);

module.exports = router;