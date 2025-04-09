# 🌐 Task Manager - API Backend

API desarrollada con **Express** y **TypeScript**, alojada en **Firebase Cloud Functions** y utilizando **Firebase Firestore** como base de datos para el almacenamiento de usuarios y tareas.

## 📋 Endpoints disponibles

- `GET /tasks`: Obtener la lista de todas las tareas.
- `POST /tasks`: Agregar una nueva tarea.
- `PUT /tasks/:id`: Actualizar los datos de una tarea existente.
- `DELETE /tasks/:id`: Eliminar una tarea existente.
- `POST /users/login`: Buscar si un usuario ha sido creado (o iniciar sesión).
- `POST /users`: Agregar un nuevo usuario.

## 🧱 Arquitectura de la API

La API sigue principios de arquitectura limpia y separación por capas:

```
src/
├── interfaces/http/         # Controladores de rutas y middlewares
├── application/use-cases/   # Casos de uso (lógica de negocio)
├── domain/entities/         # Entidades de dominio (Task, User)
├── infrastructure/          # Implementaciones externas (Firestore, JWT)
├── config/                  # Configuración general (Firebase, middlewares)
└── main.ts                  # Punto de entrada para Express
```

- **Firebase Cloud Functions** para desplegar la API sin servidor.
- **Firestore** como base de datos NoSQL.
- **JWT** para autenticación de usuarios.
- Validación de entradas y errores controlados.

## 🛠️ Tecnologías usadas

- **Express + TypeScript**
- **Firebase Functions & Firestore**
- **JWT** para autenticación
- **Swagger** para documentación (opcional)
- **Jest** para testing

## 🧪 Testing

Se realizaron pruebas unitarias para los principales casos de uso:

- Crear, obtener, actualizar y eliminar tareas.
- Crear y loguear usuarios.

Además, se realizaron pruebas de integración para los endpoints utilizando supertest.

---

## 🧑‍💻 Cómo ejecutar localmente

```bash
git clone https://github.com/AleVzT/atom-api-backend
cd tu-repo
npm install
firebase emulators:start
```

---

## 📁 Scripts importantes

```bash
ng build                                            # Build para producción
ng test                                              # Correr tests
firebase deploy  --only functions                    # Desplegar en Firebase functions
```

---

## 📄 Documentación Swagger

Podés acceder a la documentación interactiva de la API en el siguiente enlace:

🔗 **Swagger Docs:** [https://api-65aqrsu3vq-uc.a.run.app/docs](https://api-65aqrsu3vq-uc.a.run.app/docs)

---

## 📌 Notas finales

Este proyecto representa una propuesta profesional con foco en buenas prácticas de desarrollo. Cualquier feedback será bien recibido para seguir mejorando. 🙌

---

## 👤 Autor

**Alexandro Garcia**\
Desarrollador Web

