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

/**
 * cambiar el formrto:  usa id en lugar de `_id` y elimina campos internos.
 */
estudianteSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Estudiante', estudianteSchema);
