const usuario = require('../models/usuario');

exports.crearUsuario = async (req, res) => {
    try {
        const nuevoUsuario = await usuario.create(req.body);
        res.status(201).json(nuevoUsuario);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }

};

exports.modificarUsuario = async (req, res) => {
    try {
        const usuarioModificado = await usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioModificado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json(usuarioModificado);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await usuario.find().sort({ createdAt: -1 });
    return res.status(200).json(usuarios.map((u) => u.toJSON()));
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar usuarios', mensaje: error.message });
  }
};


//FALTA
//listar usuarios - get
//eliminar usuario - delete
//obtener usuario por id - get