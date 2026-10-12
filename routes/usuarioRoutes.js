const express = require('express');
const router = express.Router();
const {
  listarUsuarios,
  obtenerUsuario,
  crearUsuario,
  modificarUsuario,
  eliminarUsuario
} = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

router.use(verificarToken, verificarRol('administrador'));

router.get('/', listarUsuarios);
router.get('/:id', obtenerUsuario);
router.post('/', crearUsuario);
router.put('/:id', modificarUsuario);
router.delete('/:id', eliminarUsuario);

module.exports = router;

