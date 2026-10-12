
 //Rellena la base de datos con datos de ejemplo para que la API tenga
//información desde el primer arranque.
 

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Usuario = require('../models/usuario');
const Estudiante = require('../models/estudiante');
const Solicitud = require('../models/solicitud');

const PASSWORD_SEED = '123';

/** Usuarios a crear */
const USUARIOS_SEED = [
  { nombre: 'Administrador ISIL',     correo: 'admin@isil.pe',       rol: 'administrador' },
  { nombre: 'Personal Académico',     correo: 'personal@isil.pe',    rol: 'personal' },
  { nombre: 'Diana Clabel',           correo: 'diana@isil.pe',       rol: 'estudiante' },
  { nombre: 'Linder Pereyra',         correo: 'linder@isil.pe',      rol: 'estudiante' },
  { nombre: 'Valeria Restrepo',       correo: 'valeria@isil.pe',     rol: 'estudiante' },
  { nombre: 'Carlos Mendoza',         correo: 'carlos@isil.pe',      rol: 'estudiante' },
  { nombre: 'Andrea Morales',         correo: 'andrea@isil.pe',      rol: 'estudiante' },
  { nombre: 'Mateo Salazar',          correo: 'mateo@isil.pe',       rol: 'estudiante' }
];

// Estudiantes 
const ESTUDIANTES_SEED = [
  {
    correoUsuario: 'valeria@isil.pe',
    codigo: 'ISIL-742910',
    nombre: 'Valeria Restrepo',
    carrera: 'Ingeniería de Sistemas',
    email: 'valeria.restrepo@isil.pe',
    avatarUrl: 'user.png'
  },
  {
    correoUsuario: 'carlos@isil.pe',
    codigo: 'ISIL-738201',
    nombre: 'Carlos Mendoza',
    carrera: 'Ingeniería de Software',
    email: 'carlos.mendoza@isil.pe',
    avatarUrl: 'user.png'
  },
  {
    correoUsuario: 'andrea@isil.pe',
    codigo: 'ISIL-751094',
    nombre: 'Andrea Morales',
    carrera: 'Administración y Sistemas',
    email: 'andrea.morales@isil.pe',
    avatarUrl: 'user.png'
  },
  {
    correoUsuario: 'mateo@isil.pe',
    codigo: 'ISIL-760342',
    nombre: 'Mateo Salazar',
    carrera: 'Desarrollo de Software',
    email: 'mateo.salazar@isil.pe',
    avatarUrl: 'user.png'
  }
];

//Solicitudes académicas 

const SOLICITUDES_SEED = [
  {
    codigoEstudiante: 'ISIL-742910',
    codigoRadicado: 'SOL-2024-001',
    tipoTramite: 'Revisión de Calificación Final',
    descripcionDetalle: 'Corte 3 • Calificación 2.8 a 3.5',
    fechaRadicacion: '14 Feb 2024',
    estado: 'Aprobada',
    justificacion:
      'Solicito la recalificación del tercer examen parcial debido a que los puntos 3 y 4 fueron evaluados con base en una rúbrica desactualizada.'
  },
  {
    codigoEstudiante: 'ISIL-738201',
    codigoRadicado: 'SOL-2024-002',
    tipoTramite: 'Cancelación Extemporánea',
    descripcionDetalle: 'Causa de Fuerza Mayor Médica',
    fechaRadicacion: '18 Feb 2024',
    estado: 'En Revisión',
    justificacion:
      'Intervención quirúrgica imprevista con orden médica de incapacidad total durante el periodo de evaluaciones.'
  },
  {
    codigoEstudiante: 'ISIL-751094',
    codigoRadicado: 'SOL-2024-003',
    tipoTramite: 'Homologación de Créditos',
    descripcionDetalle: 'Electivas de Profundización (6 cr)',
    fechaRadicacion: '21 Feb 2024',
    estado: 'Pendiente',
    justificacion:
      'Homologación de dos asignaturas electivas cursadas y aprobadas en el programa previo de Ingeniería de Software.'
  },
  {
    codigoEstudiante: 'ISIL-742910',
    codigoRadicado: 'SOL-2024-004',
    tipoTramite: 'Certificado de Notas con Apostilla',
    descripcionDetalle: 'Trámite Bilingüe Español / Inglés',
    fechaRadicacion: '10 Feb 2024',
    estado: 'Aprobada',
    justificacion:
      'Emisión de certificado oficial de notas legalizado para postulación a pasantía de investigación internacional.'
  },
  {
    codigoEstudiante: 'ISIL-760342',
    codigoRadicado: 'SOL-2024-005',
    tipoTramite: 'Habilitación Supletoria',
    descripcionDetalle: 'Examen extraordinario aprobado con 4.0',
    fechaRadicacion: '02 Feb 2024',
    estado: 'Aprobada',
    justificacion:
      'Habilitación supletoria por cruce de horario justificado en el calendario regular de exámenes finales.'
  },
  {
    codigoEstudiante: 'ISIL-742910',
    codigoRadicado: 'SOL-2024-006',
    tipoTramite: 'Beca de Excelencia e Investigación',
    descripcionDetalle: 'Exención 100% Matrícula Semestre',
    fechaRadicacion: '24 Feb 2024',
    estado: 'Pendiente',
    justificacion:
      'Postulación a la beca institucional de mérito académico e investigación por promedio acumulado superior a 18.5 y publicación en semillero.'
  }
];

/**
 * Ejecuta la siembra. Si recibe `forzar=true` limpia las colecciones
 * antes de insertar (útil para reiniciar el ambiente).
 */
async function sembrar({ forzar = false } = {}) {
  if (forzar) {
    console.log('🧹 Limpiando colecciones existentes...');
    await Promise.all([
      Usuario.deleteMany({}),
      Estudiante.deleteMany({}),
      Solicitud.deleteMany({})
    ]);
  }

  // ---------- Usuarios ----------
  const totalUsuarios = await Usuario.countDocuments();
  if (totalUsuarios === 0) {
    console.log('👤 Creando usuarios del seed...');
    
    const salt = await bcrypt.genSalt(10);
    const passwordHasheada = await bcrypt.hash(PASSWORD_SEED, salt);
    const usuariosParaInsertar = USUARIOS_SEED.map((u) => ({
      ...u,
      password: passwordHasheada
    }));
    await Usuario.insertMany(usuariosParaInsertar);
    console.log(`    ${usuariosParaInsertar.length} usuarios creados (password="${PASSWORD_SEED}").`);
  } else {
    console.log(` Ya existen ${totalUsuarios} usuarios, se omite la siembra.`);
  }

  const usuariosPorCorreo = await Usuario.find().lean();
  const mapUsuarioPorCorreo = new Map(usuariosPorCorreo.map((u) => [u.correo, u]));

  // ---------- Estudiantes ----------
  const totalEstudiantes = await Estudiante.countDocuments();
  if (totalEstudiantes === 0) {
    console.log('🎓 Creando estudiantes del seed...');
    const docs = ESTUDIANTES_SEED.map((e) => ({
      codigo: e.codigo,
      nombre: e.nombre,
      carrera: e.carrera,
      email: e.email,
      avatarUrl: e.avatarUrl,
      usuarioId: mapUsuarioPorCorreo.get(e.correoUsuario)?._id || null
    }));
    await Estudiante.insertMany(docs);
    console.log(`    ${docs.length} estudiantes creados.`);
  } else {
    console.log(` Ya existen ${totalEstudiantes} estudiantes, se omite la siembra.`);
  }

  const estudiantesPorCodigo = await Estudiante.find().lean();
  const mapEstudiantePorCodigo = new Map(estudiantesPorCodigo.map((e) => [e.codigo, e]));

  // ---------- Solicitudes ----------
  const totalSolicitudes = await Solicitud.countDocuments();
  if (totalSolicitudes === 0) {
    console.log('📄 Creando solicitudes del seed...');
    const docs = SOLICITUDES_SEED.map((s) => {
      const est = mapEstudiantePorCodigo.get(s.codigoEstudiante);
      if (!est) {
        throw new Error(`No se encontró el estudiante ${s.codigoEstudiante} para la solicitud ${s.codigoRadicado}`);
      }
      const { codigoEstudiante, ...resto } = s;
      return { ...resto, estudianteId: est._id };
    });
    await Solicitud.insertMany(docs);
    console.log(`   ✔ ${docs.length} solicitudes creadas.`);
  } else {
    console.log(`📄 Ya existen ${totalSolicitudes} solicitudes, se omite la siembra.`);
  }

  console.log('✅ Seed finalizado.');
}

/**
 * Permite ejecutar el archivo de forma independiente:
 *   node seed/seedData.js
 */
if (require.main === module) {
  (async () => {
    try {
      if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI no está definido en .env');
      }
      await mongoose.connect(process.env.MONGO_URI);
      console.log('📦 Conectado a MongoDB');

      const forzar = process.argv.includes('--force');
      await sembrar({ forzar });

      await mongoose.disconnect();
      console.log('🔌 Conexión cerrada');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error en el seed:', err);
      process.exit(1);
    }
  })();
}

module.exports = { sembrar };
