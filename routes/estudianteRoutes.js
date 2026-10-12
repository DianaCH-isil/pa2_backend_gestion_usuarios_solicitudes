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

router.use(verificarToken, verificarRol('administrador'));

router.get('/', listarEstudiantes);
router.get('/:codigo', obtenerEstudiantePorCodigo);

router.post('/', crearEstudiante);
router.put('/:id', modificarEstudiante);
router.delete('/:id', eliminarEstudiante);

module.exports = router;

