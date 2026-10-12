const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');

// Importa tu ruta de autenticación para el manejo de JWT
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ estado: 'OK' });
});

app.use('/api', usuarioRoutes);
app.use('/api', estudianteRoutes);
app.use('/api', solicitudRoutes);

// Registra la ruta de autenticación (quedará accesible en /api/auth/register y /api/auth/login)
app.use('/api/auth', authRoutes);

async function iniciarServidor() {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); 
    }
}

iniciarServidor();