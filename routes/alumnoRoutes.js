const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { crearAlumnoConUsuario } = require('../controllers/alumnoController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

//POST /api/admin/alumnos
//Crea un Usuario (cualquier rol) y, si el rol es 'estudiante',también crea su Estudiante asociado.

router.post(
  '/',
  verificarToken,
  verificarRol('administrador'),
  [
    body('nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('password')
      .isString()
      .isLength({ min: 3 })
      .withMessage('La contraseña debe tener al menos 3 caracteres'),
    body('rol')
      .isIn(['estudiante', 'administrador', 'personal'])
      .withMessage('Rol no permitido')
  ],
  crearAlumnoConUsuario
);

module.exports = router;
