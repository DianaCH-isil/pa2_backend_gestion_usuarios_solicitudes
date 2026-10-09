const Estudiante = require('../models/estudiante');


exports.listarEstudiantes = async (_req, res) => {
  try {
    const estudiantes = await Estudiante.find().sort({ createdAt: -1 });
    return res.status(200).json(estudiantes.map((e) => e.toJSON()));
  } catch (error) {
    return res.status(500).json({ error: 'Error al listar estudiantes', mensaje: error.message });
  }
};


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


exports.crearEstudiante = async (req, res) => {
  try {
    const nuevo = await Estudiante.create(req.body);
    return res.status(201).json(nuevo.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al crear estudiante', mensaje: error.message });
  }
};


exports.modificarEstudiante = async (req, res) => {
  try {
    const actualizado = await Estudiante.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!actualizado) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Estudiante no encontrado' });
    }
    return res.status(200).json(actualizado.toJSON());
  } catch (error) {
    return res.status(400).json({ error: 'Error al actualizar estudiante', mensaje: error.message });
  }
};


exports.eliminarEstudiante = async (req, res) => {
  try {
    const eliminado = await Estudiante.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ error: 'No encontrado', mensaje: 'Estudiante no encontrado' });
    }
    return res.status(200).json({ mensaje: 'Estudiante eliminado', id: eliminado._id });
  } catch (error) {
    return res.status(400).json({ error: 'Error al eliminar estudiante', mensaje: error.message });
  }
};
