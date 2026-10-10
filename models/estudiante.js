const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema(
  {
    codigo: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    nombre: { type: String, required: true, trim: true },
    carrera: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    avatarUrl: { type: String, default: 'user.png' },
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Estudiante', estudianteSchema);

//ejemplo de objeto de estudiante
// {
//     correoUsuario: 'valeria@isil.pe',
//     codigo: 'ISIL-742910',
//     nombre: 'Valeria Restrepo',
//     carrera: 'Ingeniería de Sistemas',
//     email: 'valeria.restrepo@isil.pe',
//     avatarUrl: 'user.png'
//   },