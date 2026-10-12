const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const Solicitud = require('../models/solicitud');
const Estudiante = require('../models/estudiante');

const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const ESTADOS_VALIDOS = ['Aprobada', 'En Revisión', 'Pendiente', 'Rechazada'];

// Formatea la fecha actual como ej. "21 Sep 2026" 
function obtenerFechaActualFormateada() {
  const ahora = new Date();
  const dia = String(ahora.getDate()).padStart(2, '0');
  const mes = MESES[ahora.getMonth()];
  const anio = ahora.getFullYear();
  return `${dia} ${mes} ${anio}`;
}

// Genera el siguiente código correlativo "SOL-YYYY-NNN" 

async function generarProximoRadicado() {
  const anio = new Date().getFullYear();
  const total = await Solicitud.countDocuments();
  const numero = String(total + 1).padStart(3, '0');
  return `SOL-${anio}-${numero}`;
}


function serializarSolicitud(doc) {
  const obj = doc.toJSON ? doc.toJSON() : doc;
  if (obj.estudianteId) {
    obj.estudiante = {
      id: obj.estudianteId._id || obj.estudianteId,
      codigo: obj.estudianteId.codigo,
      nombre: obj.estudianteId.nombre,
      carrera: obj.estudianteId.carrera,
      email: obj.estudianteId.email,
      avatarUrl: obj.estudianteId.avatarUrl
    };
    delete obj.estudianteId;
  }
  return obj;
}

//GET /api/solicitudes/mias
 
exports.obtenerMisSolicitudes = async (req, res) => {
  try {
    const usuario = req.usuario;

    // Si el usuario no es estudiante, no tiene "mis solicitudes"
    if (usuario.rol !== 'estudiante') {
      return res.status(200).json([]);
    }

    // Buscar el Estudiante vinculado a este Usuario
    const estudiante = await Estudiante.findOne({ usuarioId: usuario._id });
    if (!estudiante) {
      return res.status(200).json([]);
    }

    const solicitudes = await Solicitud.find({ estudianteId: estudiante._id })
      .populate('estudianteId')
      .sort({ createdAt: -1 });

    return res.status(200).json(solicitudes.map(serializarSolicitud));
  } catch (error) {
    return res.status(500).json({
      error: 'Error al obtener mis solicitudes',
      mensaje: error.message
    });
  }
};

// GET /api/solicitudes

exports.listarSolicitudes = async (req, res) => {
  try {
    const { estado, codigoAlumno } = req.query;
    const filtro = {};

    if (typeof estado === 'string' && estado.trim().length > 0) {
      filtro.estado = estado;
    }

    if (typeof codigoAlumno === 'string' && codigoAlumno.trim().length > 0) {
      const codigo = codigoAlumno.trim().toUpperCase();
      const estudiante = await Estudiante.findOne({ codigo });
      if (!estudiante) {
        return res.status(200).json([]);
      }
      filtro.estudianteId = estudiante._id;
    }

    const solicitudes = await Solicitud.find(filtro)
      .populate('estudianteId')
      .sort({ createdAt: -1 });

    return res.status(200).json(solicitudes.map(serializarSolicitud));
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar solicitudes', mensaje: error.message });
  }
};

/**
 * GET /api/solicitudes/:id
 */
exports.obtenerSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    let solicitud;

    if (mongoose.Types.ObjectId.isValid(id)) {
      solicitud = await Solicitud.findById(id).populate('estudianteId');
    } else {
      // Permitir búsqueda por codigoRadicado
      solicitud = await Solicitud.findOne({ codigoRadicado: id }).populate('estudianteId');
    }

    if (!solicitud) {
      return res.status(404).json({ error: 'No encontrado', mensaje: `No existe la solicitud '${id}'` });
    }
    return res.status(200).json(serializarSolicitud(solicitud));
  } catch (error) {
    return res.status(400).json({ error: 'Error al obtener solicitud', mensaje: error.message });
  }
};

/**
 * POST /api/solicitudes
 */
exports.crearSolicitud = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: 'Error de validación', detalles: errores.array() });
  }

  try {
    const {
      tipoTramite,
      descripcionDetalle,
      estudianteCodigo,
      justificacion,
      aceptaTerminos
    } = req.body;

    if (aceptaTerminos !== true) {
      return res.status(400).json({
        error: 'Términos no aceptados',
        mensaje: 'Debe aceptar los términos y condiciones para radicar la solicitud.'
      });
    }

    if (!estudianteCodigo) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'estudianteCodigo es obligatorio.'
      });
    }

    const codigoLimpio = String(estudianteCodigo).trim().toUpperCase();
    const estudiante = await Estudiante.findOne({ codigo: codigoLimpio });
    if (!estudiante) {
      return res.status(404).json({
        error: 'Estudiante no encontrado',
        mensaje: `No existe un estudiante con código ${codigoLimpio}`
      });
    }

    const nueva = new Solicitud({
      codigoRadicado: await generarProximoRadicado(),
      tipoTramite,
      descripcionDetalle: descripcionDetalle || 'Trámite en gestión académica',
      fechaRadicacion: obtenerFechaActualFormateada(),
      estado: 'Pendiente',
      estudianteId: estudiante._id,
      justificacion
    });

    await nueva.save();
    const creada = await Solicitud.findById(nueva._id).populate('estudianteId');
    return res.status(201).json(serializarSolicitud(creada));
  } catch (error) {
    return res.status(500).json({ error: 'Error al crear solicitud', mensaje: error.message });
  }
};

/**
 * PATCH /api/solicitudes/:id/estado
 */
exports.actualizarEstado = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: 'Error de validación', detalles: errores.array() });
  }

  try {
    const { estado } = req.body;
    const { id } = req.params;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({
        error: 'Estado inválido',
        mensaje: `El estado debe ser uno de: ${ESTADOS_VALIDOS.join(', ')}`
      });
    }

    let solicitud;
    if (mongoose.Types.ObjectId.isValid(id)) {
      solicitud = await Solicitud.findById(id);
    } else {
      solicitud = await Solicitud.findOne({ codigoRadicado: id });
    }

    if (!solicitud) {
      return res.status(404).json({ error: 'No encontrado', mensaje: `No existe la solicitud '${id}'` });
    }

    solicitud.estado = estado;
    await solicitud.save();

    const actualizada = await Solicitud.findById(solicitud._id).populate('estudianteId');
    return res.status(200).json(serializarSolicitud(actualizada));
  } catch (error) {
    return res.status(500).json({ error: 'Error al actualizar estado', mensaje: error.message });
  }
};

/**
 * DELETE /api/solicitudes/:id
 */
exports.eliminarSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const filtro = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { codigoRadicado: id };

    const eliminada = await Solicitud.findOneAndDelete(filtro);
    if (!eliminada) {
      return res.status(404).json({ error: 'No encontrado', mensaje: `No existe la solicitud '${id}'` });
    }
    return res.status(200).json({ mensaje: 'Solicitud eliminada', id: eliminada._id });
  } catch (error) {
    return res.status(500).json({ error: 'Error al eliminar solicitud', mensaje: error.message });
  }
};

/**
 * GET /api/metricas
 * Devuelve conteos agregados por estado.
 */
exports.obtenerMetricas = async (_req, res) => {
  try {
    const solicitudes = await Solicitud.find();
    const metricas = solicitudes.reduce(
      (acc, { estado }) => {
        acc.total += 1;
        if (estado === 'Aprobada') acc.aprobadas += 1;
        else if (estado === 'En Revisión') acc.enRevision += 1;
        else if (estado === 'Pendiente') acc.pendientes += 1;
        else if (estado === 'Rechazada') acc.rechazadas += 1;
        return acc;
      },
      { total: 0, aprobadas: 0, enRevision: 0, pendientes: 0, rechazadas: 0 }
    );
    return res.status(200).json(metricas);
  } catch (error) {
    return res.status(500).json({ error: 'Error al obtener métricas', mensaje: error.message });
  }
};
