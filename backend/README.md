# Task Manager API - Arquitectura Hexagonal

Aplicación simple tipo CRUD desarrollada con Node.js, Express, TypeScript y PostgreSQL, siguiendo los principios de la **Arquitectura Hexagonal (Puertos y Adaptadores)**.

---

## 📁 Estructura del Proyecto

```text
backend/
├── src/
│   ├── domain/                  <-- [Capa de Dominio: Entidades y Puertos]
│   │   ├── Task.ts              <-- Entidad de Dominio
│   │   └── TaskRepository.ts    <-- Puerto de Salida (Interface)
│   ├── application/             <-- [Capa de Aplicación: Casos de Uso]
│   │   └── TaskService.ts       <-- Lógica de negocio y casos de uso
│   ├── infrastructure/          <-- [Capa de Infraestructura: Adaptadores]
│   │   ├── db.ts                <-- Adaptador de conexión a PostgreSQL (Pool)
│   │   ├── PostgresTaskRepository.ts <-- Adaptador de persistencia
│   │   └── ExpressTaskController.ts  <-- Adaptador de entrada HTTP REST
│   └── index.ts                 <-- [Composición e Inyección de Dependencias]
├── .env                         <-- Variables de entorno
├── .env.example                 <-- Plantilla de variables de entorno
├── package.json
└── tsconfig.json
```

---

## ⚙️ Configuración y Requisitos

- **Node.js** >= 18
- **PostgreSQL** en ejecución
- Base de datos: `taskmanagerdb`
- Usuario: `postgre` (o `postgres`)
- Contraseña: `daniel2025`

Las variables están configuradas en `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgre
DB_PASSWORD=daniel2025
DB_NAME=taskmanagerdb
```

> **Nota:** La tabla `tasks` se crea automáticamente al iniciar el servidor si aún no existe.

---

## 🚀 Comandos para Ejecutar

Dentro de la carpeta `backend/`:

```bash
# Modo desarrollo con recarga automática
npm run dev

# Ejecutar directamente
npm start

# Compilar TypeScript a JavaScript (dist/)
npm run build

# Ejecutar compilado en producción
npm run start:prod
```

---

## 📡 Endpoints del API

Base URL: `http://localhost:3000/tasks` o `http://localhost:3000/api/tasks`

| Método | Endpoint | Descripción | Body (JSON) |
|---|---|---|---|
| `GET` | `/tasks` | Obtener todas las tareas | Ninguno |
| `GET` | `/tasks/:id` | Obtener una tarea por su ID | Ninguno |
| `POST` | `/tasks` | Crear una nueva tarea | `{"title": "...", "description": "..."}` |
| `PUT` | `/tasks/:id` | Editar una tarea | `{"title": "...", "description": "...", "completed": true}` |
| `PATCH` | `/tasks/:id` | Actualización parcial | Campos opcionales |
| `PATCH` | `/tasks/:id/toggle` | Alternar estado completado | Ninguno |
| `PATCH` | `/tasks/:id/complete`| Marcar como completada | `{"completed": true}` (opcional) |
| `DELETE`| `/tasks/:id` | Eliminar una tarea | Ninguno |

---

## 🧪 Ejemplos de Peticiones

### 1. Crear Tarea
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Aprender Hexagonal", "description": "Estudiar puertos y adaptadores"}'
```

### 2. Listar Tareas
```bash
curl http://localhost:3000/tasks
```

### 3. Editar Tarea
```bash
curl -X PUT http://localhost:3000/tasks/<ID_DE_LA_TAREA> \
  -H "Content-Type: application/json" \
  -d '{"title": "Dominar Hexagonal", "description": "Completar la práctica"}'
```

### 4. Marcar como Completada (Toggle)
```bash
curl -X PATCH http://localhost:3000/tasks/<ID_DE_LA_TAREA>/toggle
```

### 5. Eliminar Tarea
```bash
curl -X DELETE http://localhost:3000/tasks/<ID_DE_LA_TAREA>
```
