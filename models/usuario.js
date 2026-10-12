const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: { type: String, required: true, minlength: 3 },
    rol: {
      type: String,
      enum: ['estudiante', 'administrador', 'personal'],
      default: 'estudiante'
    }
  },
  { timestamps: true }
);

//Middleware pre-save: hashea la contraseña automáticamente con bcrypt
 
usuarioSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Compara una contraseña en texto plano contra el hash almacenado.
 
usuarioSchema.methods.compararPassword = function (passwordPlano) {
  return bcrypt.compare(passwordPlano, this.password);
};

// Quita el password del JSON cuando se serializa el documento.

usuarioSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
