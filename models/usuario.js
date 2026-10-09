const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    rol: { 
        type: String, 
        enum: ['estudiante', 'administrador', 'personal'], 
        default: 'estudiante' 
    }
});

// Middleware limpio usando async/await (sin usar 'next')
usuarioSchema.pre('save', async function() {
    // Si la contraseña no ha sido modificada, nos salimos
    if (!this.isModified('password')) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Usuario', usuarioSchema);