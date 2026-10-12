const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


async function verificarToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Debe enviar un token JWT en el header Authorization: Bearer <token>'
      });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(payload.sub);

    if (!usuario) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'El usuario asociado al token ya no existe'
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'No autorizado',
      mensaje: 'Token inválido o expirado',
      detalle: error.message
    });
  }
}


function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        error: 'No autorizado',
        mensaje: 'Se requiere autenticación previa'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        error: 'Acceso denegado',
        mensaje: `Esta acción requiere uno de los roles: ${rolesPermitidos.join(', ')}`
      });
    }

    next();
  };
}

module.exports = { verificarToken, verificarRol };
