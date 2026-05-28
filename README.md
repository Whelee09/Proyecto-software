# CollabBoard

Plataforma web de colaboracion para equipos de trabajo. Permite gestionar equipos, proyectos, tareas (tablero Kanban), calendario compartido, chat en tiempo real e intercambio de archivos, con un panel administrativo integrado.

## Stack tecnologico

| Capa | Tecnologias |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Socket.IO Client, Zustand |
| Backend | NestJS, TypeScript, Prisma ORM, Socket.IO, Multer, Swagger |
| Base de datos | PostgreSQL 16 |
| Autenticacion | JWT (access token), bcrypt, guards por rol |
| CI | GitHub Actions |

## Estructura del proyecto

```
Proyecto-software/
└── collabboard/
    ├── backend/          # API REST + WebSocket (NestJS)
    │   ├── prisma/       # Schema y migraciones
    │   └── src/          # Modulos: auth, users, teams, projects, tasks,
    │                     #          events, channels, messages, files, dashboard
    ├── frontend/         # Aplicacion web (Next.js)
    │   ├── app/          # Rutas: dashboard, teams, projects, chat, calendar, admin
    │   ├── components/   # Componentes reutilizables
    │   └── context/      # Contexto de autenticacion
    └── docker-compose.yml
```

## Requisitos previos

- Node.js 20+
- npm
- Docker (para PostgreSQL local)

## Instalacion local

```bash
# 1. Levantar la base de datos
cd collabboard
docker compose up -d

# 2. Configurar y arrancar el backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

En otra terminal:

```bash
# 3. Configurar y arrancar el frontend
cd collabboard/frontend
cp .env.example .env.local
npm install
npm run dev
```

| Servicio | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:4000 |
| Swagger | http://localhost:4000/docs |

## Variables de entorno

**Backend** (`backend/.env`):

```env
DATABASE_URL="postgresql://collabboard:collabboard@localhost:5432/collabboard?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
ADMIN_EMAIL=""
CLOUDINARY_URL=""
S3_BUCKET=""
```

**Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
```

## Credenciales seed

| Rol | Email | Contrasena |
|---|---|---|
| Admin | admin@collabboard.com | Admin123* |
| Miembro | (usuarios seed) | Member123* |

Para promover un usuario existente a admin, configura `ADMIN_EMAIL` en el `.env` del backend antes de arrancar.

## Funcionalidades principales

- **Autenticacion**: registro, login con JWT, perfil de usuario.
- **Equipos**: crear equipos, agregar miembros, gestionar roles.
- **Proyectos**: proyectos asociados a equipos con miembros propios.
- **Tablero Kanban**: tareas con columnas, prioridad, asignaciones y comentarios.
- **Calendario**: eventos compartidos por equipo y por proyecto.
- **Chat en tiempo real**: canales por equipo/proyecto via WebSocket (Socket.IO).
- **Archivos**: subida y descarga por proyecto (PDF, imagenes, Word, Excel, ZIP; max 10 MB).
- **Dashboard administrativo**: resumen global de usuarios, equipos, proyectos y tareas.
- **Notificaciones**: modulo de notificaciones en backend.

## API principal

| Recurso | Metodos |
|---|---|
| `/auth` | `POST /register`, `POST /login`, `GET /me` |
| `/users` | `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| `/teams` | `POST /`, `GET /`, `GET /:id`, `PATCH /:id`, `DELETE /:id`, `POST /:id/members` |
| `/projects` | `POST /`, `GET /team/:teamId`, `GET /:id`, `PATCH /:id`, `DELETE /:id` |
| `/tasks` | `POST /`, `GET /project/:projectId`, `PATCH /:id`, `POST /:id/comments` |
| `/events` | `POST /`, `GET /team/:teamId`, `GET /project/:projectId` |
| `/channels` | `POST /`, `GET /team/:teamId`, `GET /project/:projectId` |
| `/messages` | `GET /channel/:channelId`, `POST /` |
| `/files` | `POST /upload/:projectId`, `GET /project/:projectId`, `GET /download/:id` |
| `/dashboard` | `GET /summary` |

## WebSocket (chat)

El cliente se conecta enviando el token JWT en `auth.token`. Eventos:

| Evento | Descripcion |
|---|---|
| `join_channel` | Unirse a un canal |
| `leave_channel` | Salir de un canal |
| `send_message` | Enviar un mensaje |
| `new_message` | Recibir un mensaje nuevo |

El backend valida que el usuario pertenezca al equipo del canal antes de procesar cualquier evento.

## Tests

```bash
cd collabboard/backend
npm test
```

Cubre: registro, login invalido, creacion de equipos, creacion de tareas y dashboard summary. El workflow de CI ejecuta estos tests automaticamente en cada push y pull request a `main`.

## Despliegue

| Servicio | Plataforma recomendada | Notas |
|---|---|---|
| Frontend | Vercel | Usar `collabboard/frontend` como root; configurar `NEXT_PUBLIC_API_URL` |
| Backend | Render / Railway | `npm run build` + `npm run prisma:deploy` + `npm run start` |
| Base de datos | Supabase / Neon / Railway | Copiar la `DATABASE_URL` al `.env` del backend |

## Mejoras futuras

- Integracion con Google Calendar y Outlook.
- Almacenamiento en Cloudinary o S3.
- Notificaciones push.
- Recuperacion de contrasena por correo.
- Invitacion de miembros por correo.
