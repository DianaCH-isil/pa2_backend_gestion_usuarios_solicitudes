  const mongoose = require('mongoose');
  const Solicitud = require('../models/solicitud');
  const Estudiante = require('../models/estudiante');

  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const ESTADOS_VALIDOS = ['Aprobada', 'En Revisión', 'Pendiente', 'Rechazada'];

  // obtenemos la fecha actual en formato "dd MMM yyyy"
  function obtenerFechaActualFormateada() {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, '0');
    const mes = MESES[ahora.getMonth()];
    const anio = ahora.getFullYear();
    return `${dia} ${mes} ${anio}`;
  }

  //codigo radicado: SOL-2024-001
  async function generarProximoRadicado() {
    const anio = new Date().getFullYear();
    const total = await Solicitud.countDocuments();
    const numero = String(total + 1).padStart(3, '0');
    return `SOL-${anio}-${numero}`;
  }

  // serializa la solicitud para incluir los datos del estudiante en lugar de solo su ID
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

  //Enpoint: GET /api/solicitudes - listarSolicitudes
  exports.listarSolicitudes = async (req, res) => {
    try {
      const solicitudes = await Solicitud.find()
        .populate('estudianteId');

      const resultado = solicitudes.map(serializarSolicitud);

      res.status(200).json(resultado);
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al listar las solicitudes',
        error: error.message
      });
    }
  };

  //POST /api/solicitudes - crearSolicitud
  exports.crearSolicitud = async (req, res) => {
    try {
      const {
        tipoTramite,
        descripcionDetalle,
        estudianteId,
        justificacion,
        estado
      } = req.body;

      if (
        !tipoTramite ||
        !descripcionDetalle ||
        !estudianteId ||
        !justificacion
      ) {
        return res.status(400).json({
          mensaje: 'Todos los campos obligatorios deben estar completos'
        });
      }

      if (!mongoose.Types.ObjectId.isValid(estudianteId)) {
        return res.status(400).json({
          mensaje: 'El ID del estudiante no es válido'
        });
      }

      const estudiante = await Estudiante.findById(estudianteId);

      if (!estudiante) {
        return res.status(404).json({
          mensaje: 'No se encontró el estudiante'
        });
      }

      if (estado && !ESTADOS_VALIDOS.includes(estado)) {
        return res.status(400).json({
          mensaje: 'El estado de la solicitud no es válido'
        });
      }

      const nuevaSolicitud = new Solicitud({
        codigoRadicado: await generarProximoRadicado(),
        tipoTramite,
        descripcionDetalle,
        fechaRadicacion: obtenerFechaActualFormateada(),
        estado: estado || 'Pendiente',
        estudianteId,
        justificacion
      });

      await nuevaSolicitud.save();

      await nuevaSolicitud.populate('estudianteId');

      res.status(201).json(serializarSolicitud(nuevaSolicitud));
    } catch (error) {
      if (error.name === 'ValidationError' ||
          error.code === 11000) {
        return res.status(400).json({
          mensaje: 'Error en los datos de la solicitud',
          error: error.message
        });
      }

      res.status(500).json({
        mensaje: 'Error al crear la solicitud',
        error: error.message
      });
    }
  };

  // GET /api/solicitudes/:id - obtenerSolicitudPorId
exports.obtenerSolicitudPorId = async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id)
      .populate('estudianteId');

    if (!solicitud) {
      return res.status(404).json({
        mensaje: 'No se encontró la solicitud'
      });
    }

    res.status(200).json(serializarSolicitud(solicitud));
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener la solicitud',
      error: error.message
    });
  }
};

// PATCH /api/solicitudes/:id - actualizarSolicitud
exports.actualizarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!solicitud) {
      return res.status(404).json({
        mensaje: 'No se encontró la solicitud'
      });
    }

    res.status(200).json(solicitud);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar la solicitud',
      error: error.message
    });
  }
};

// DELETE /api/solicitudes/:id - eliminarSolicitud
exports.eliminarSolicitud = async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        mensaje: 'No se encontró la solicitud'
      });
    }

    res.status(200).json({
      mensaje: 'Solicitud eliminada correctamente'
    });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar la solicitud',
      error: error.message
    });
  }
};