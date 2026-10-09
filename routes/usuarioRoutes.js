const express = require('express');
const router = express.Router();
const { crearUsuario, modificarUsuario, listarUsuarios} = require('../controllers/usuarioController');

router.post('/usuarios', crearUsuario);
router.put('/usuarios/:id', modificarUsuario);
router.get('/usuarios', listarUsuarios);
//FALTA
//listar usuarios - get
//eliminar usuario - delete
//obtener usuario por id - get

module.exports = router;