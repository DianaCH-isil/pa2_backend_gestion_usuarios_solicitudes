const express = require('express');
const { body, param } = require('express-validator');
const router = express.Router();
const {
  listarSolicitudes,
  obtenerMisSolicitudes,
  obtenerSolicitud,
  crearSolicitud,
  actualizarEstado,
  eliminarSolicitud
} = require('../controllers/solicitudController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

router.get('/', verificarToken, verificarRol('administrador', 'personal'), listarSolicitudes);
router.get('/mias', verificarToken, obtenerMisSolicitudes);
router.get('/:id', obtenerSolicitud);

router.post(
  '/',
  verificarToken,
  [
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
  ],
  crearSolicitud
);

router.patch(
  '/:id/estado',
  verificarToken,
  verificarRol('administrador', 'personal'),
  [
    body('estado')
      .isIn(['Aprobada', 'En Revisión', 'Pendiente', 'Rechazada'])
      .withMessage('Estado no válido')
  ],
  actualizarEstado
);

router.delete(
  '/:id',
  verificarToken,
  verificarRol('administrador'),
  eliminarSolicitud
);

module.exports = router;
