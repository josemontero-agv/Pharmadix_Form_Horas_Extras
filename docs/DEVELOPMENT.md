# Guía de Desarrollo - Pharmadix Times

Este documento proporciona las pautas para el desarrollo, configuración y estándares del Sistema de Gestión de Tiempos Pharmadix v2.0.

## 1. Requisitos Previos
- Docker y Docker Compose.
- Node.js 18+ (LTS).
- VS Code con extensiones recomendadas: ESLint, Prettier, Prisma, Tailwind CSS.

## 2. Estructura del Proyecto
```
/
├── frontend/           # PWA en React + Vite
├── backend/            # API REST en Fastify/Node.js
├── docker-compose.yml  # Orquestación de contenedores
└── docs/               # Documentación técnica
```

## 3. Estándares de Código
- **TypeScript:** Obligatorio para frontend y backend. Prohibido el uso de `any`.
- **Commits:** Seguir convenciones de [Conventional Commits](https://www.conventionalcommits.org/).
- **UI:** Usar componentes de `shadcn/ui` y utilidades de `Tailwind CSS`.
- **Validación:** Usar `Zod` para validar todos los esquemas de entrada en la API.

### Colores Institucionales Pharmadix
Aplicar consistentemente en toda la interfaz:

```css
/* Color Corporativo Principal */
--brand-purple: #410468;  /* MORADO PHARMADIX - Color más representativo */

/* Colores Brand Complementarios */
--brand-blue: #009FE3;    /* Azul Pharmadix */
--brand-green: #00A651;   /* Verde Pharmadix */
--brand-orange: #F15A29;  /* Naranja Pharmadix */

/* Colores Funcionales */
--primary: #410468;       /* Morado - Botones principales, header */
--success: #00A651;       /* Verde - Confirmaciones, Entrada */
--warning: #F15A29;       /* Naranja - Advertencias, Salida */
--info: #009FE3;          /* Azul - Información */
--background: #F8F9FA;    /* Fondo claro */
--text: #1A1A1A;          /* Texto principal */
--text-muted: #6C757D;    /* Texto secundario */
```

**Uso del Morado #410468 (PRIORITARIO):**
- ✅ Header/Navbar superior
- ✅ Logo de la aplicación
- ✅ Botón principal "Nueva Hoja" en Dashboard
- ✅ Botones de acción primarios
- ✅ Estados activos/seleccionados
- ✅ Enlaces importantes

**Configuración en Tailwind:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'pharmadix': {
          purple: '#410468',    // Color principal
          blue: '#009FE3',
          green: '#00A651',
          orange: '#F15A29',
        }
      }
    }
  }
}
```

**Ejemplos de Uso:**
```tsx
// Botón principal
<Button className="bg-pharmadix-purple hover:bg-pharmadix-purple/90">
  Nueva Hoja
</Button>

// Header
<header className="bg-pharmadix-purple text-white">
  Pharmadix Times
</header>
```

## 4. Flujo de Trabajo para el Tomador de Tiempos (PWA)
1. **Offline-First:** Los datos deben guardarse siempre primero en `IndexedDB` (vía Dexie.js).
2. **Sync:** La sincronización debe ser transparente para el usuario, gestionada por un Service Worker en segundo plano.
3. **UX Táctil:** Botones de acción deben tener un tamaño mínimo de 48px para facilitar el uso con guantes o en tablets.

## 5. Base de Datos y Migraciones
- Usar **Prisma ORM** para cualquier cambio en el esquema.
- Comando para generar migración: `npx prisma migrate dev --name <nombre_descriptivo>`.

## 6. Auditoría y Cumplimiento
Cada transacción debe registrar automáticamente:
- `created_by` (ID del Tomador de Tiempos).
- `ip_address`.
- `device_info` (User Agent).
- `server_timestamp` vs `client_timestamp`.

## 7. Despliegue Local
1. Clonar el repositorio.
2. Copiar `.env.example` a `.env` y configurar variables.
3. Ejecutar `docker-compose up --build`.
4. Acceder a `http://localhost`.
