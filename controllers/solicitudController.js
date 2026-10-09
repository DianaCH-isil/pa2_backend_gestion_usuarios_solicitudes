const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
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

//FALTA
//Enpoint: GET /api/solicitudes - listarSolicitudes
//Enpoint: GET /api/solicitudes/:id -   obtenerSolicitudPorId
//POST /api/solicitudes - crearSolicitud
//PATCH /api/solicitudes/:id -  actualizarSolicitud
//DELETE /api/solicitudes/:id - eliminarSolicitud