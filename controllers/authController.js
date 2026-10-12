const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Usuario = require('../models/usuario');

/**
 * Genera un JWT firmado con el payload del usuario.
function generarToken(usuario) {
  return jwt.sign(
    {
      sub: usuario._id.toString(),
      correo: usuario.correo,
      rol: usuario.rol
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );
}

/**
 * POST /api/auth/register
exports.registrar = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: 'Error de validación', detalles: errores.array() });
  }

  try {
    const { nombre, correo, password, rol } = req.body;

    const existente = await Usuario.findOne({ correo: correo.toLowerCase() });
    if (existente) {
      return res.status(409).json({
        error: 'Correo duplicado',
        mensaje: 'Ya existe un usuario registrado con ese correo.'
      });
    }

    const nuevoUsuario = new Usuario({ nombre, correo, password, rol });
    await nuevoUsuario.save(); // el pre-save hashea la contraseña

    const token = generarToken(nuevoUsuario);

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario: nuevoUsuario.toJSON(),
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al registrar', mensaje: error.message });
  }
};

exports.login = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: 'Error de validación', detalles: errores.array() });
  }

  try {
    const { correo, password } = req.body;
    const usuario = await Usuario.findOne({ correo: correo.toLowerCase() });

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'No existe un usuario con ese correo.'
      });
    }

    const ok = await usuario.compararPassword(password);
    if (!ok) {
      return res.status(401).json({
        error: 'Credenciales inválidas',
        mensaje: 'La contraseña es incorrecta.'
      });
    }

    const token = generarToken(usuario);

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: usuario.toJSON(),
      token
    });
  } catch (error) {
    return res.status(500).json({ error: 'Error al iniciar sesión', mensaje: error.message });
  }
};
exports.perfil = async (req, res) => {
  return res.status(200).json({ usuario: req.usuario.toJSON() });
};
