# Task Manager - Proyecto Fullstack

Aplicación CRUD completa para la gestión de tareas desarrollada con arquitectura moderna:
- **Backend:** Node.js, Express, TypeScript y PostgreSQL bajo **Arquitectura Hexagonal (Puertos y Adaptadores)**.
- **Frontend:** React, TypeScript, Vite y CSS moderno responsivo.

---

## Arquitectura y Estructura

```text
proyecto hexagonal/
├── backend/
│   ├── src/
│   │   ├── domain/                  <-- [Capas de Dominio: Entidades y Puertos]
│   │   │   ├── Task.ts
│   │   │   └── TaskRepository.ts
│   │   ├── application/             <-- [Capa de Aplicación: Casos de Uso]
│   │   │   └── TaskService.ts
│   │   ├── infrastructure/          <-- [Capa de Infraestructura: Adaptadores]
│   │   │   ├── db.ts
│   │   │   ├── PostgresTaskRepository.ts
│   │   │   └── ExpressTaskController.ts
│   │   └── index.ts                 <-- [Composición e Inyección de Dependencias]
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/              <-- [Componentes UI: Header, Form, List, Item, Modal, Filter, Toast]
│   │   ├── services/                <-- [Cliente HTTP REST API]
│   │   ├── styles/                  <-- [Estilos CSS modernos y responsivos]
│   │   ├── types/                   <-- [Definiciones TypeScript]
│   │   ├── App.tsx                  <-- [Contenedor principal con gestión de estado]
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
└── package.json                     <-- Scripts unificados
```

---

## Requisitos Previos

- **Node.js** >= 18
- **PostgreSQL** instalado y en ejecución
- Base de datos: `taskmanagerdb`
- Usuario: `postgre` (o `postgres`)
- Contraseña: `daniel2025`

> **Nota:** La tabla `tasks` se crea automáticamente en PostgreSQL al iniciar el backend si aún no existe.

---

## Cómo Ejecutar el Proyecto

### 1. Iniciar el Backend (Puerto 3000)
Abre una terminal y ejecuta:
```bash
cd backend
npm run dev
# o desde la raíz: npm run dev:backend
```
El servidor backend estará listo en `http://localhost:3000`.

### 2. Iniciar el Frontend (Puerto 5173)
En otra terminal, ejecuta:
```bash
cd frontend
npm run dev
# o desde la raíz: npm run dev:frontend
```
Abre en tu navegador: **`http://localhost:5173`**

---

## Características del Frontend

- **Crear Tareas:** Formulario rápido con título y descripción opcional expandible.
- **Marcar como Completadas:** Alternar estado con animación visual y tachado inmediato (actualización optimista).
- **Editar Tareas:** Modal interactivo para modificar título, descripción y estado.
- **Eliminar Tareas:** Confirmación y eliminación con notificación.
- **Filtros y Búsqueda:**
  - Pestañas: *Todas*, *Pendientes* y *Completadas* con contador en tiempo real.
  - Búsqueda en vivo por texto en título o descripción.
- **Barra de Progreso:** Porcentaje y contador de avance general.
- **Indicador de Conexión:** Detecta en tiempo real si el backend está en línea o desconectado.
- **Notificaciones Toast:** Feedback visual para cada acción (éxito o error).
- **Diseño Moderno y Responsivo:** Adaptado a pantallas móviles, tabletas y computadoras de escritorio.
