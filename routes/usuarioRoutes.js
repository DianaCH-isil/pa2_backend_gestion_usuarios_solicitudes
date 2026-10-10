const express = require('express');
const router = express.Router();
const { crearUsuario, modificarUsuario, listarUsuarios, obtenerUsuario, eliminarUsuario } = require('../controllers/usuarioController');

router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id', modificarUsuario);
router.get('/usuarios', listarUsuarios);
router.get('/usuarios/:id', obtenerUsuario);
router.delete('/usuarios/:id', eliminarUsuario);

module.exports = router;