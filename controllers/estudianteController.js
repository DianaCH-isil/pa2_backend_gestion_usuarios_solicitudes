const Estudiante = require('../models/estudiante');
const Usuario = require('../models/usuario');
const Solicitud = require('../models/solicitud');

//GET /api/estudiantes
 
exports.listarEstudiantes = async (_req, res) => {
  try {
    //orden descendente por fecha de creación
    const estudiantes = await Estudiante.find().sort({ createdAt: -1 });
    return res.status(200).json(estudiantes.map((e) => e.toJSON()));
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar estudiantes', mensaje: error.message });
  }
};

//GET /api/estudiantes/:codigo
 
exports.obtenerEstudiantePorCodigo = async (req, res) => {
  try {
    const codigo = String(req.params.codigo || '').trim().toUpperCase();
    const estudiante = await Estudiante.findOne({ codigo });
    if (!estudiante) {
      return res.status(404).json({
        error: 'No encontrado',
        mensaje: `No existe estudiante con código ${codigo}`
      });
    }
    return res.status(200).json(estudiante.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al buscar estudiante', mensaje: error.message });
  }
};

// POST /api/estudiantes
 
exports.crearEstudiante = async (req, res) => {
  try {
    const nuevo = await Estudiante.create(req.body);
    return res.status(201).json(nuevo.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al crear estudiante', mensaje: error.message });
  }
};

//PUT /api/estudiantes/:id
 
exports.modificarEstudiante = async (req, res) => {
  try {
    const nombre = req.body?.nombre != null ? String(req.body.nombre).trim() : '';
    const carrera = req.body?.carrera != null ? String(req.body.carrera).trim() : '';

    if (!nombre || !carrera) {
      return res.status(400).json({
        error: 'Datos incompletos',
        mensaje: 'nombre y carrera son obligatorios.'
      });
    }

    const actualizado = await Estudiante.findByIdAndUpdate(
      req.params.id,
      { nombre, carrera },
      { new: true, runValidators: true }
    );
    if (!actualizado) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Estudiante no encontrado' });
    }
    return res.status(200).json(actualizado.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar estudiante', mensaje: error.message });
  }
};

//DELETE /api/estudiantes/:id
 
exports.eliminarEstudiante = async (req, res) => {
  try {
    const estudiante = await Estudiante.findById(req.params.id);
    if (!estudiante) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Estudiante no encontrado' });
    }

    await Solicitud.deleteMany({ estudianteId: estudiante._id });

    if (estudiante.usuarioId) {
      await Usuario.findByIdAndDelete(estudiante.usuarioId);
    }

    await Estudiante.findByIdAndDelete(estudiante._id);

    return res.status(200).json({
      mensaje: 'Estudiante y cuenta eliminados',
      id: estudiante._id
    });
  } catch (error) {
    return res.status(400).json({ error: 'Error al eliminar estudiante', mensaje: error.message });
  }
};
