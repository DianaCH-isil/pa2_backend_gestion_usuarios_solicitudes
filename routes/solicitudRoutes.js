
//funcion de ayuda para generar el proximo radicado de la solicitud

// async function generarProximoRadicado() {
//   const anio = new Date().getFullYear();
//   const total = await Solicitud.countDocuments();
//   const numero = String(total + 1).padStart(3, '0');
//   return `SOL-${anio}-${numero}`;
// }

//funcion de ayuda para obtener la fecha actual en formato "DD MMM YYYY"

// function obtenerFechaActualFormateada() {
//   const ahora = new Date();
//   const dia = String(ahora.getDate()).padStart(2, '0');
//   const mes = MESES[ahora.getMonth()];
//   const anio = ahora.getFullYear();
//   return `${dia} ${mes} ${anio}`;
// }

//---------------------------------------------------------------------

//NOTA: El codigo  de estudiantes debe ser uno de los que ya existen en la base de datos, de lo contrario no se podra crear la solicitud.

//ejemplo de objeto de solicitud

// {
//     codigoEstudiante: 'ISIL-738201',
//     codigoRadicado: 'SOL-2024-002',
//     tipoTramite: 'Cancelación Extemporánea',
//     descripcionDetalle: 'Causa de Fuerza Mayor Médica',
//     fechaRadicacion: '18 Feb 2024',
//     estado: 'En Revisión',
//     justificacion:
//       'Intervención quirúrgica imprevista con orden médica de incapacidad total durante el periodo de evaluaciones.'
//   }