const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { registrar, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/auth');

router.post(
  '/register',
  [
    body('nombre').isString().trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('password')
      .isString()
      .isLength({ min: 3 })
      .withMessage('La contraseña debe tener al menos 3 caracteres'),
    body('rol')
      .optional()
      .isIn(['estudiante', 'administrador', 'personal'])
      .withMessage('Rol no permitido')
  ],
  registrar
);

router.post(
  '/login',
  [
    body('correo').isEmail().withMessage('Debe ser un correo válido'),
    body('password').isString().notEmpty().withMessage('La contraseña es obligatoria')
  ],
  login
);

router.get('/me', verificarToken, perfil);

module.exports = router;
