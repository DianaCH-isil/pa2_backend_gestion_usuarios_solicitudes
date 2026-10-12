const Usuario = require('../models/usuario');
const Estudiante = require('../models/estudiante');
const Solicitud = require('../models/solicitud');

/**
 * Lista todos los usuarios registrados.
 */
exports.listarUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ createdAt: -1 });
    return res.status(200).json(usuarios.map((u) => u.toJSON()));
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar usuarios', mensaje: error.message });
  }
};

/**
 * GET /api/usuarios/:id  (sólo admin)
 */
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Usuario no encontrado' });
    }
    return res.status(200).json(usuario.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al obtener usuario', mensaje: error.message });
  }
};

/**
 * Crea un usuario manualmente. Alternativa al /api/auth/register.
 */
exports.crearUsuario = async (req, res) => {
  try {
    const nuevoUsuario = await Usuario.create(req.body);
    return res.status(201).json(nuevoUsuario.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al crear usuario', mensaje: error.message });
  }
};

/**
 * Actualiza los datos de un usuario. 
 */
exports.modificarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Usuario no encontrado' });
    }

    const { nombre, correo, rol, password } = req.body;

    if (nombre != null) {
      const nombreLimpio = String(nombre).trim();
      if (!nombreLimpio) {
        return res.status(400).json({ error: 'Datos inválidos', mensaje: 'El nombre es obligatorio.' });
      }
      usuario.nombre = nombreLimpio;
    }

    if (correo != null) {
      const correoLimpio = String(correo).toLowerCase().trim();
      if (!correoLimpio) {
        return res.status(400).json({ error: 'Datos inválidos', mensaje: 'El correo es obligatorio.' });
      }
      usuario.correo = correoLimpio;
    }

    if (rol != null) {
      const rolesValidos = ['estudiante', 'administrador', 'personal'];
      if (!rolesValidos.includes(rol)) {
        return res.status(400).json({ error: 'Datos inválidos', mensaje: 'Rol no permitido.' });
      }
      usuario.rol = rol;
    }

    if (password != null && String(password).trim().length > 0) {
      if (String(password).length < 3) {
        return res.status(400).json({
          error: 'Datos inválidos',
          mensaje: 'La contraseña debe tener al menos 3 caracteres.'
        });
      }
      usuario.password = password;
    }

    await usuario.save();

    const estudiante = await Estudiante.findOne({ usuarioId: usuario._id });
    if (estudiante) {
      estudiante.nombre = usuario.nombre;
      estudiante.email = usuario.correo;
      await estudiante.save();
    }

    return res.status(200).json(usuario.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar usuario', mensaje: error.message });
  }
};

/**
 * Elimina un usuario por id.
 */
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Usuario no encontrado' });
    }

    const estudiante = await Estudiante.findOne({ usuarioId: usuario._id });
    if (estudiante) {
      await Solicitud.deleteMany({ estudianteId: estudiante._id });
      await Estudiante.findByIdAndDelete(estudiante._id);
    }

    await Usuario.findByIdAndDelete(usuario._id);

    return res.status(200).json({ mensaje: 'Usuario eliminado', id: usuario._id });
  } catch (error) {
    return res.status(400).json({ error: 'Error al eliminar usuario', mensaje: error.message });
  }
};
