const express = require('express');
const router = express.Router();
const {
  listarEstudiantes,
  obtenerEstudiantePorCodigo,
  crearEstudiante,
  modificarEstudiante,
  eliminarEstudiante
} = require('../controllers/estudianteController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

/**
 * GET  /api/estudiantes           (público)
 * GET  /api/estudiantes/:codigo   (público)
 * POST /api/estudiantes           (admin o personal)
 * PUT  /api/estudiantes/:id       (admin o personal)
 * DEL  /api/estudiantes/:id       (admin)
 */
router.get('/', listarEstudiantes);
router.get('/:codigo', obtenerEstudiantePorCodigo);

router.post('/', verificarToken, verificarRol('administrador', 'personal'), crearEstudiante);
router.put('/:id', verificarToken, verificarRol('administrador', 'personal'), modificarEstudiante);
router.delete('/:id', verificarToken, verificarRol('administrador'), eliminarEstudiante);

module.exports = router;

