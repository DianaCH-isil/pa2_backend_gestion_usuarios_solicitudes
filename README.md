# Plataforma de Gestión de Solicitudes Académicas - Backend
**Curso:** PROGRAMACION WEB AVANZADA  **Sección/Código:** 4060.202620  **Evaluación:** PA2  **Equipo:** Grupo 6

## 1. Integrantes
| Integrante | Rol | Aporte principal |
|---|---|---|
| Diana Clabel | Developer / Backend | Modelos, conexión a MongoDB, CRUD estudiante, crear y eliminar usuario, Implementación auth. |
| Roberto Palacios | Developer / Backend | Endpoints de usuarios (obtener por id y eliminar), pruebas HTTP y README. |
| Giancarlo Quispe Quiroz | Developer / Backend | Endpoints de solicitudes: obtener por ID, actualizar y eliminar. |
| Jose Miguel Polick | Developer / Backend | Endpoints de solicitudes: listar y crear. |
| Aaron Pereyra Cabrejos| Developer / Backend | Implementación de autenticación con JWT. |

## 2. Descripción y objetivo
**Problema:** La plataforma de gestión de solicitudes académicas necesita una API que administre usuarios y solicitudes, conserve la información entre ejecuciones del servidor y proteja el acceso a los recursos.

**Objetivo:** Desarrollar una API REST con Node.js y Express, con persistencia en MongoDB mediante Mongoose y autenticación con JWT.

**Solución desarrollada:** Se implementó un servidor Express con rutas, middleware (`helmet`, `cors`, `express.json`, `morgan`) y operaciones CRUD para usuarios, estudiantes y solicitudes. Los datos se guardan en MongoDB mediante modelos de Mongoose. Las contraseñas se encriptan con bcrypt y el acceso se protege con tokens JWT. La conexión a la base de datos se abre una sola vez al iniciar el servidor (`config/database.js`) y se ejecuta un *seed* inicial de datos para entorno de desarrollo.

## 3. Cómo ejecutar o revisar
```bash
# Clonar el repositorio
git clone https://github.com/DianaCH-isil/pa2_backend_gestion_usuarios_solicitudes.git

# Entrar a la carpeta del proyecto
cd pa2_backend_gestion_usuarios_solicitudes

# Instalar dependencias
npm install

# Crear el archivo .env en la raíz (ver variables abajo)

# Levantar el servidor
node server.js
```
**Variables de entorno (`.env`, no se sube al repositorio):**
```
MONGO_URI=mongodb://localhost:27017/solicitudes
PORT=3000

```
**Pasos de revisión:**
1. Verificar que el servidor responde en `http://localhost:3000/api/health`.
2. Probar los endpoints públicos (`/api/auth/login`, `/api/auth/register`) sin token.
3. Obtener un token JWT con `POST /api/auth/login` usando las credenciales del seed (`admin@isil.pe` / `123`).
4. Probar los endpoints protegidos con Postman enviando el header `Authorization: Bearer <token>`.
5. Confirmar la persistencia en MongoDB Compass (base `solicitudes`, colecciones `usuarios`, `estudiantes`, `solicitudes`).


## 4. Evidencias

### Endpoints disponibles

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/api/health` | Estado del servidor y versión de la API | No |
| POST | `/api/auth/register` | Registrar un nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión y obtener JWT | No |
| GET | `/api/auth/me` | Obtener perfil del usuario autenticado | Sí (cualquier rol) |
| GET | `/api/usuarios` | Listar usuarios del sistema | Sí (administrador) |
| POST | `/api/usuarios` | Crear usuario manualmente | Sí (administrador) |
| GET | `/api/usuarios/:id` | Obtener un usuario por id | Sí (administrador) |
| PUT | `/api/usuarios/:id` | Modificar datos de un usuario (con sincronización a Estudiante vinculado) | Sí (administrador) |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario, su estudiante y sus solicitudes (cascada) | Sí (administrador) |
| GET | `/api/estudiantes` | Listar estudiantes | Sí (administrador) |
| POST | `/api/estudiantes` | Crear estudiante | Sí (administrador) |
| GET | `/api/estudiantes/:codigo` | Obtener estudiante por código | Sí (administrador) |
| PUT | `/api/estudiantes/:id` | Modificar nombre/carrera de un estudiante | Sí (administrador) |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante, su usuario y sus solicitudes (cascada) | Sí (administrador) |
| POST | `/api/admin/alumnos` | Crear Usuario y, si rol=estudiante, también su Estudiante asociado | Sí (administrador) |
| GET | `/api/solicitudes` | Listar solicitudes (filtros: `estado`, `codigoAlumno`) | Sí (administrador, personal) |
| GET | `/api/solicitudes/mias` | Listar solicitudes del estudiante autenticado | Sí (cualquier usuario autenticado) |
| GET | `/api/solicitudes/:id` | Obtener una solicitud por `ObjectId` o por `codigoRadicado` | Si |
| POST | `/api/solicitudes` | Crear una solicitud (requiere `estudianteCodigo`, `tipoTramite`, `justificacion`, `aceptaTerminos:true`) | Sí (cualquier usuario autenticado) |
| PATCH | `/api/solicitudes/:id/estado` | Cambiar estado de una solicitud (`Aprobada`, `En Revisión`, `Pendiente`, `Rechazada`) | Sí (administrador, personal) |
| DELETE | `/api/solicitudes/:id` | Eliminar una solicitud | Sí (administrador) |



### Estados válidos de una solicitud
`Aprobada` · `En Revisión` · `Pendiente` · `Rechazada`

### Roles válidos del sistema
`administrador` · `personal` · `estudiante`

### Por actividad
- **Actividad 1 — Servidor Express y CRUD base:** configuración del servidor en `server.js`, estructura de `routes/`, `controllers/` y aplicación de middlewares (`helmet`, `cors`, `express.json`, `morgan`). CRUD demostrado con solicitudes HTTP desde Postman sobre los recursos de usuarios, estudiantes y solicitudes.
- **Actividad 2 — Persistencia con MongoDB:** conexión centralizada en `config/database.js` (apertura única al iniciar), modelos Mongoose en `models/` (`Usuario`, `Estudiante`, `Solicitud`) con validaciones de esquema, transformaciones `toJSON` y hooks de hasheo de contraseñas con `bcrypt`. Datos visibles y verificables en MongoDB Compass.
- **Actividad 3 — Autenticación y seguridad con JWT:** módulo `auth` (`authController` + `authRoutes` + middleware `verificarToken` y `verificarRol`) que firma y verifica tokens con `JWT_SECRET`, controla acceso por rol y aplica la protección a todas las rutas que la requieren. Se añadió también la protección de cabeceras HTTP con `helmet` y `cors`.
- **Actividad 4 — Operaciones avanzadas y datos de prueba:** endpoint `POST /api/admin/alumnos` que crea Usuario + Estudiante atómicamente con rollback ante códigos duplicados, módulo `seed/seedData.js` que inicializa la base con usuarios, estudiantes y solicitudes de ejemplo, y middleware de logging con `morgan` para auditoría de las peticiones.

### Datos sembrados automáticamente
Al iniciar el servidor por primera vez, `seed/seedData.js` inserta:
- **8 usuarios** (1 administrador, 1 personal, 6 estudiantes) — contraseña común `123`.
- **4 estudiantes** vinculados a sus respectivos usuarios.
- **6 solicitudes académicas** de ejemplo (revisión de calificación, cancelación extemporánea, homologación, certificado con apostilla, habilitación supletoria, beca de excelencia).

### Capturas de pruebas
carpeta `evidencias/` o enlaces a las colecciones de Postman.

## 5. Matriz de participación
| Integrante | Desarrollo | Pruebas | Documentación | Exposición | Evidencia de participación |
|---|---|---|---|---|---|
| Diana Clabel | Alta | Media | Alta | [Sí/No] | **Commit inicial** (`ef805f4`, `47c41aa`): estructura del proyecto, `config/database.js`, los 3 modelos Mongoose, controladores y rutas base de usuarios/estudiantes/solicitudes, `server.js`. **Commit de integración** (`302c124`): `alumnoController` (creación atómica Usuario+Estudiante), `authController` refactorizado, `seed/seedData.js` con 8 usuarios + 4 estudiantes + 6 solicitudes, aplicación de middlewares a las rutas, ajuste integral de los controladores. |
| Roberto Palacios Lara | Alta | Media | Alta | [Sí/No] | Commit `2e537f9` (rama `feature/usuarios-readme`): implementación de `obtenerUsuario` y `eliminarUsuario` con borrado en cascada (Estudiante + Solicitudes), ajustes en `usuarioRoutes.js` y creación del `README.md` inicial del proyecto. |
| Giancarlo Quispe Quiroz | Alta | Alta | Media | [Sí/No] | Commit `b64b634` (rama `feat/solicitudes-crud`): CRUD completo de solicitudes — `obtenerSolicitud`, `actualizarEstado` con validaciones, `eliminarSolicitud`, serialización con `populate('estudianteId')`, filtros por estado y código de alumno; pruebas HTTP con Postman y ajustes posteriores al `README.md` (`944824e`, `aca9888`). |
| Jose Miguel Polick | Alta | Media | Media | [Sí/No] | Commit `6acf0e6` (rama `feat/solicitudes-listar-crear`): implementación de `listarSolicitudes` (con ordenamiento por fecha) y `crearSolicitud` (generación automática de `codigoRadicado` tipo `SOL-YYYY-NNN`, normalización de fechas en español, validaciones de `tipoTramite` y `justificacion`); exposición de las rutas en `server.js`.  |
| Aaron Pereyra Cabrejos | Alta | Media | Alta | [Sí/No] | Serie de commits (`582be07`, `75566f8`, `fc7c365`, `beb0d93`, `9e34302`) (rama `feat/auth-JWT`): implementación completa del módulo de autenticación — `authController` con `registrar`y `login`; middleware `verificarToken`, `verificarRol(...roles)`;  integración de `authRoutes` en `server.js`;  |

## 6. Video de exposición
Video público de YouTube: https://youtu.be/327YUPQtJ40

## 7. Conclusiones
- **Servidor y CRUD (Actividad 1):** Express permitió organizar la API en rutas, controladores y middleware, separando la lógica de cada endpoint y facilitando el trabajo en equipo por ramas. La convención de carpetas (`routes/`, `controllers/`, `models/`, `middlewares/`) facilitó la integración sin conflictos.
- **Persistencia (Actividad 2):** Mongoose y MongoDB hicieron que los datos se conserven entre ejecuciones. La conexión se abre una sola vez al iniciar y los modelos la reutilizan en cada petición. Los hooks `pre('save')` para hashear contraseñas y las transformaciones `toJSON` (que ocultan `_id`, `__v` y `password`) son claves para no exponer información sensible.
- **Seguridad (Actividad 3):** bcrypt protege las contraseñas en reposo y JWT controla el acceso a los recursos firmando un token con `sub`, `correo` y `rol`. El middleware `verificarToken` se aplica por ruta según el nivel de privilegio requerido, evitando acoplar la autenticación a la lógica de negocio.
- **Operaciones avanzadas (Actividad 4):** La creación atómica Usuario+Estudiante en `/api/admin/alumnos` demuestra manejo de transacciones lógicas con rollback manual, y el script de *seed* garantiza un entorno reproducible para demos y revisión del profesor.
- **Trabajo colaborativo:** El uso de ramas en GitHub evitó conflictos y permitió integrar el trabajo de cada integrante. La separación por dominios (auth, usuarios, estudiantes, solicitudes) permitió que cada miembro trabajara de forma autónoma y se integrara al final mediante Pull Requests.
