const express = require('express');
const router = express.Router();
const {
  listarEstudiantes,
  obtenerEstudiantePorCodigo,
  crearEstudiante,
  modificarEstudiante,
  eliminarEstudiante
} = require('../controllers/estudianteController');


router.get('/estudiantes', listarEstudiantes);
router.get('/estudiantes/:id', obtenerEstudiantePorCodigo);

router.post('/estudiantes', crearEstudiante);
router.put('/estudiantes/:id', modificarEstudiante);
router.delete('/estudiantes/:id', eliminarEstudiante);

module.exports = router;
