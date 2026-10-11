router.get('/', listarSolicitudes);
router.get('/:id', obtenerSolicitud);

router.post(
  '/',
  [
    body('tipoTramite').isString().trim().notEmpty().withMessage('tipoTramite es obligatorio'),
    body('justificacion')
      .isString()
      .trim()
      .isLength({ min: 5 })
      .withMessage('La justificación debe tener al menos 5 caracteres'),
    body('estudianteCodigo')
      .isString()
      .trim()
      .notEmpty()
      .withMessage('estudianteCodigo es obligatorio')
  ],
  crearSolicitud
);
