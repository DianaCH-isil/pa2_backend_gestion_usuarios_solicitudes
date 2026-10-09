const mongoose = require('mongoose');

const solicitudSchema = new mongoose.Schema(
  {
    codigoRadicado: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    tipoTramite: { type: String, required: true, trim: true },
    descripcionDetalle: { type: String, required: true, trim: true },
    fechaRadicacion: { type: String, required: true },
    estado: {
      type: String,
      enum: ['Aprobada', 'En Revisión', 'Pendiente', 'Rechazada'],
      default: 'Pendiente'
    },
    estudianteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Estudiante',
      required: true
    },
    justificacion: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Solicitud', solicitudSchema);