require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const { sembrar } = require('./seed/seedData');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const estudianteRoutes = require('./routes/estudianteRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
//const metricasRoutes = require('./routes/metricasRoutes');
const alumnoRoutes = require('./routes/alumnoRoutes');

const app = express();

//Middlewares  
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/api/health', (_req, res) => {
  res.status(200).json({
    estado: 'OK',
    servicio: 'API REST - Gestión de Solicitudes Académicas ISIL',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

//Rutas REST
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/estudiantes', estudianteRoutes);
app.use('/api/solicitudes', solicitudRoutes);
//app.use('/api/metricas', metricasRoutes);
app.use('/api/admin/alumnos', alumnoRoutes);

/* ===================== 404 ===================================== */
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    mensaje: `No existe el endpoint ${req.method} ${req.originalUrl}`
  });
});
async function iniciarServidor() {
    try {
        await connectDB();
        //Datos de relleno  para pruebas y desarrollo. S
         await sembrar();
        const PORT = process.env.PORT || 3000;

        app.listen(PORT, () => {
            console.log('================================================================');
            console.log('🚀 API REST de Solicitudes Académicas ISIL ejecutándose');
            console.log(`📡 URL Base: http://localhost:${PORT}`);
            console.log('📋 Endpoints principales:');
            console.log(`   - GET    /api/health`);
            console.log(`   - POST   /api/auth/register`);
            console.log(`   - POST   /api/auth/login`);
            console.log(`   - GET    /api/auth/me                 (JWT)`);
            console.log(`   - GET    /api/solicitudes             (JWT admin/personal)`);
            console.log(`   - GET    /api/solicitudes/mias       (JWT estudiante)`);
            console.log(`   - POST   /api/solicitudes             (JWT)`);
            console.log(`   - PATCH  /api/solicitudes/:id/estado  (JWT admin/personal)`);
            console.log(`   - GET    /api/estudiantes             (JWT admin)`);
            console.log(`   - GET    /api/usuarios                (JWT admin)`);
            console.log(`   - POST   /api/admin/alumnos           (JWT admin)`);
            console.log('================================================================');
            
        });

    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); 
    }
}

iniciarServidor();