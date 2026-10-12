const Usuario = require('../models/usuario');
const Estudiante = require('../models/estudiante');
const { validationResult } = require('express-validator');

exports.crearAlumnoConUsuario = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: 'Error de validación', detalles: errores.array() });
  }

  try {
    const { nombre, correo, password, rol, codigo, carrera, avatarUrl } = req.body;

    const correoNormalizado = String(correo).toLowerCase().trim();

    // Si es estudiante, exigir campos académicos
    if (rol === 'estudiante') {
      if (!codigo || !carrera) {
        return res.status(400).json({
          error: 'Datos incompletos',
          mensaje: 'Para rol=estudiante se requieren codigo y carrera.'
        });
      }
    }

    // Verificar duplicados
    const existeUsuario = await Usuario.findOne({ correo: correoNormalizado });
    if (existeUsuario) {
      return res.status(409).json({
        error: 'Correo duplicado',
        mensaje: 'Ya existe un usuario registrado con ese correo.'
      });
    }

    // 1) Crear Usuario (el pre-save hook hashea la contraseña)
    const nuevoUsuario = new Usuario({
      nombre: String(nombre).trim(),
      correo: correoNormalizado,
      password,
      rol: rol || 'estudiante'
    });
    await nuevoUsuario.save();

    // 2) Si es estudiante, crear el Estudiante vinculado
    let nuevoEstudiante = null;
    if (rol === 'estudiante') {
      const codigoNormalizado = String(codigo).toUpperCase().trim();

      const existeEstudiante = await Estudiante.findOne({ codigo: codigoNormalizado });
      if (existeEstudiante) {
        // Rollback: borrar el Usuario recién creado
        await Usuario.findByIdAndDelete(nuevoUsuario._id);
        return res.status(409).json({
          error: 'Código duplicado',
          mensaje: 'Ya existe un estudiante registrado con ese código.'
        });
      }

      nuevoEstudiante = new Estudiante({
        codigo: codigoNormalizado,
        nombre: String(nombre).trim(),
        carrera: String(carrera).trim(),
        email: correoNormalizado,
        avatarUrl: avatarUrl || 'user.png',
        usuarioId: nuevoUsuario._id
      });
      await nuevoEstudiante.save();
    }

    return res.status(201).json({
      mensaje: rol === 'estudiante'
        ? 'Alumno creado correctamente'
        : 'Usuario creado correctamente',
      usuario: nuevoUsuario.toJSON(),
      estudiante: nuevoEstudiante ? nuevoEstudiante.toJSON() : null
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Error al crear usuario',
      mensaje: error.message
    });
  }
};
