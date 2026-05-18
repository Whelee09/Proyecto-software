# CollabBoard

CollabBoard es una plataforma web de colaboracion para equipos de trabajo. Incluye autenticacion JWT, equipos, proyectos, tablero Kanban, calendario compartido, chat en tiempo real, intercambio de archivos y dashboard administrativo.

## Tecnologias

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Axios, Socket.IO Client.
- Backend: NestJS, TypeScript, Prisma, PostgreSQL, Socket.IO, Multer, Swagger.
- Seguridad: JWT access token, bcrypt, guards por rol y validaciones con class-validator.
- Despliegue previsto: Vercel para frontend, Render/Railway para backend y Supabase/Neon/Railway para PostgreSQL.

## Requisitos Previos

- Node.js 20 o superior.
- npm.
- Docker Desktop para PostgreSQL local.

## Instalacion Local

```bash
cd collabboard
docker compose up -d
cd backend
copy .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run start:dev
```

En otra terminal:

```bash
cd collabboard/frontend
copy .env.example .env.local
npm install
npm run dev
```

Frontend: `http://localhost:3000`  
Backend: `http://localhost:4000`  
Swagger: `http://localhost:4000/docs`

## Variables de Entorno

Backend (`backend/.env`):

```env
DATABASE_URL="postgresql://collabboard:collabboard@localhost:5432/collabboard?schema=public"
JWT_SECRET="change-me-in-production"
JWT_EXPIRES_IN="1d"
PORT=4000
FRONTEND_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE_MB=10
CLOUDINARY_URL=""
S3_BUCKET=""
```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:4000"
```

## Usuario Admin

- Email: `admin@collabboard.com`
- Password: `Admin123*`

Los usuarios seed miembros usan password `Member123*`.

## Endpoints Principales

- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/me`
- Users: `GET /users`, `GET /users/:id`, `PATCH /users/:id`, `DELETE /users/:id`
- Teams: `POST /teams`, `GET /teams`, `GET /teams/:id`, `PATCH /teams/:id`, `DELETE /teams/:id`, `POST /teams/:id/members`
- Projects: `POST /projects`, `GET /projects/team/:teamId`, `GET /projects/:id`, `PATCH /projects/:id`, `DELETE /projects/:id`
- Tasks: `POST /tasks`, `GET /tasks/project/:projectId`, `PATCH /tasks/:id`, `POST /tasks/:id/comments`
- Events: `POST /events`, `GET /events/team/:teamId`, `GET /events/project/:projectId`
- Channels: `POST /channels`, `GET /channels/team/:teamId`, `GET /channels/project/:projectId`
- Messages: `GET /messages/channel/:channelId`, `POST /messages`
- Files: `POST /files/upload/:projectId`, `GET /files/project/:projectId`, `GET /files/download/:id`
- Dashboard: `GET /dashboard/summary`

## Arquitectura

El backend esta organizado por modulos NestJS: `auth`, `users`, `teams`, `projects`, `tasks`, `events`, `channels`, `messages`, `files`, `dashboard` y `prisma`. Los controladores solo reciben HTTP y delegan a services. Los services concentran reglas de negocio, permisos de membresia y acceso a Prisma.

El frontend usa App Router con rutas privadas protegidas por `ProtectedRoute`, contexto de autenticacion, cliente Axios centralizado con `Authorization: Bearer`, componentes UI reutilizables y textos visibles en espanol.

## Chat WebSocket

El frontend se conecta al socket despues del login y envia el token en `auth.token`. Eventos implementados:

- `join_channel`
- `leave_channel`
- `send_message`
- `new_message`

El backend valida que el usuario pertenezca al equipo del canal antes de leer o enviar mensajes.

## Archivos

La carga local usa Multer en memoria y guarda en `UPLOAD_DIR`. El limite es 10MB. Tipos permitidos: PDF, imagenes, Word, Excel y ZIP. Las variables `CLOUDINARY_URL` y `S3_BUCKET` quedan preparadas para migrar almacenamiento a Cloudinary o S3.

## Tests

```bash
cd backend
npm test
```

Incluye pruebas basicas para registro, login invalido, creacion de equipos, creacion de tareas y dashboard summary.

## Despliegue

- Vercel: configurar `frontend` como root del proyecto y `NEXT_PUBLIC_API_URL` con la URL del backend.
- Render/Railway: configurar `backend`, ejecutar `npm install`, `npm run build`, `npm run prisma:deploy` y `npm run start`.
- Supabase/Neon/Railway: crear PostgreSQL y copiar su `DATABASE_URL` al backend.

## Mejoras Futuras

- Integracion con Google Calendar.
- Integracion con Outlook.
- Almacenamiento Cloudinary/S3.
- Notificaciones push.
- Recuperacion de contrasena.
- Invitacion por correo.

