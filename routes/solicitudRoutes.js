const express = require('express');
const router = express.Router();

const {
  listarSolicitudes,
  crearSolicitud
} = require('../controllers/solicitudController');
const{verificarToken, verificarRol} = requiere ('../middleware/auth')

router.get('/solicitudes', listarSolicitudes);

router.post('/solicitudes', [
  body('tipoTramite').isString().trim().notEmpty().withMessage('tipoTramite es obligatorio'),
  body('justificacion')
    .isString()
    .trim()
    .isLength({ min: 5 })
    .withMessage('La justificación debe tener al menos 5 caracteres'),
  body('estudianteCodigo')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('estudianteCodigo es obligatorio')
], crearSolicitud);

module.exports = router;
