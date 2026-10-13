# README — Evaluación
**Curso:** PROGRAMACION WEB AVANZADA  **Sección/Código:** 4060.202620  **Evaluación:** PA2  **Equipo:** Grupo [ ]

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

**Solución desarrollada:** Se implementó un servidor Express con rutas, middleware (`helmet`, `cors`, `express.json`) y operaciones CRUD para usuarios y solicitudes. Los datos se guardan en MongoDB mediante modelos de Mongoose. Las contraseñas se encriptan con bcrypt y el acceso se protege con tokens JWT. La conexión a la base de datos se abre una sola vez al iniciar el servidor (`config/database.js`).

## 3. Cómo ejecutar o revisar
```bash
# Clonar el repositorio
git clone [URL del repositorio]

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
JWT_SECRET=[definir clave propia]
```
**Pasos de revisión:**
1. Verificar que el servidor responde en `http://localhost:3000/health`.
2. Probar los endpoints con Postman usando la tabla de la sección 4.
3. Confirmar la persistencia en MongoDB Compass (base `solicitudes`).
4. [Probar el login y el acceso a rutas protegidas con el token JWT.]

No publicar contraseñas, tokens, credenciales ni datos sensibles.

## 4. Evidencias
**Endpoints disponibles**

| Método | Ruta | Descripción | Requiere token |
|---|---|---|---|
| GET | /health | Estado del servidor | No |
| POST | /api/usuarios | Crear usuario | [ ] |
| GET | /api/usuarios | Listar usuarios | [ ] |
| GET | /api/usuarios/:id | Obtener usuario por id | [ ] |
| PUT | /api/usuarios/:id | Modificar usuario | [ ] |
| DELETE | /api/usuarios/:id | Eliminar usuario | [ ] |
| POST | /api/solicitudes | Crear solicitud | [ ] |
| GET | /api/solicitudes | Listar solicitudes | [ ] |
| GET | /api/solicitudes/:id | Obtener solicitud por id | [ ] |
| PATCH | /api/solicitudes/:id | Actualizar solicitud | [] |
| DELETE | /api/solicitudes/:id | Eliminar solicitud | [] |
| POST | /api/[login] | Iniciar sesión y obtener JWT | No |

**Por actividad**
- **Actividad 1:** Servidor Express en `server.js`, rutas en `routes/`, controladores en `controllers/` y middleware (`helmet`, `cors`, `express.json`). CRUD demostrado con solicitudes HTTP.
- **Actividad 2:** Conexión a MongoDB en `config/database.js`, modelos Mongoose en `models/` y servicios REST con persistencia (datos visibles en MongoDB Compass).
- **Actividad 3:** [Completar: autenticación y seguridad con JWT.]
- **Actividad 4:** [Completar si corresponde.]

Capturas de pruebas: [carpeta `evidencias/` o enlaces].

## 5. Matriz de participación
| Integrante | Desarrollo | Pruebas | Documentación | Exposición | Evidencia de participación |
|---|---|---|---|---|---|
| Diana Clabel | Alta | Media | Media | [Sí/No] | Commit inicial: estructura, modelos, crear y modificar usuario |
| Roberto Palacios | Alta | Alta | Alta | [Sí/No] | Rama `feature/usuarios-readme`: obtener y eliminar usuario, README |
| Giancarlo Quispe Quiroz | Alta | Alta | Media | [Sí/No] | Rama `feat/solicitudes-crud`: endpoints de solicitudes por ID, actualizar y eliminar; pruebas HTTP con Postman |
| Jose Miguel Polick | Alta | Media | Media | [Sí/No] | Rama `feat/solicitudes-listar-crear`: endpoints de listar solicitudes y crear solicitudes |
| Aaron Pereyra Cabrejos | Alta | Media | Media | [Sí/No] | Rama 'feat/auth-JWT: endpoints de implementación de autenticación con JWT |

## 6. Video de exposición
Video público de YouTube: 

## 7. Conclusiones
- **Servidor y CRUD (Actividad 1):** Express permitió organizar la API en rutas, controladores y middleware, separando la lógica de cada endpoint y facilitando el trabajo en equipo por ramas.
- **Persistencia (Actividad 2):** Mongoose y MongoDB hicieron que los datos se conserven entre ejecuciones. La conexión se abre una sola vez al iniciar y los modelos la reutilizan en cada petición.
- **Seguridad (Actividad 3):** bcrypt protege las contraseñas y JWT controla el acceso a los recursos. [Ajustar según lo implementado.]
- **Trabajo colaborativo:** El uso de ramas en GitHub evitó conflictos y permitió integrar el trabajo de cada integrante.
