# Changelog - Sistema de Gestión de Tiempos Pharmadix

Todas las modificaciones notables a este proyecto serán documentadas en este archivo.

## [2.2.0] - 2026-02-03

### Añadido (Frontend)
- **Identidad Visual:** Integración del logo oficial de Pharmadix en el portal, encabezados y como favicon.
- **Funcionalidad de Escaneo QR:** Implementación del escaneo de códigos QR para identificación de operarios.
- **Componente QrScannerModal:** Nuevo modal que integra la cámara para detectar códigos QR de uniformes o gafetes.
- **Librería html5-qrcode:** Añadida como dependencia para el manejo del escaneo en el navegador.

### Corregido (Frontend)
- **Escáner QR:** Refactorización del componente QrScannerModal para usar Html5Qrcode directamente, mejorando el manejo de permisos de cámara y estados de error.

### Mejorado (Frontend)
- **Página de Registro de Operarios:** Integración del botón "Escanear QR" con el nuevo sistema de escaneo automático.
- **Identificación Automática:** El sistema ahora busca al operario en los datos maestros inmediatamente después del escaneo (por ID o número de gafete).

## [2.1.0] - 2026-01-27

### Mejorado (UX/UI)
- **Ingreso de Lotes:** Formulario unificado con campos obligatorios (Producto, Presentación, Proceso, Área, Cantidad).
- **Registro de Tiempos:** Implementación de máquina de estados (Pendiente → En Proceso → Finalizado) para prevenir inconsistencias.
- **Interfaz Inteligente:** Botón de acción contextual (Entrada/Salida) según el estado del operario.

### Añadido (Backend/DB)
- **Doble Confirmación:** Flujo de aprobación secuencial (Firma Tomador → Firma Jefe de Manufactura).
- **Campos de Auditoría:** Nuevas columnas en BD para rastrear estado de aprobación y firmas digitales.
- **Optimización BD:** Índices compuestos en tablas transaccionales para búsquedas rápidas por lote y área.

---

## [2.0.0] - 2026-01-27

### Modificado
- **Arquitectura de Software:** Migración de App Nativa a **PWA (Progressive Web App)** con React 18 y TypeScript.
- **Stack Tecnológico:**
    - **Frontend:** React + Vite + Tailwind CSS + shadcn/ui.
    - **Backend:** Node.js con Fastify (alto rendimiento) + Prisma ORM.
    - **Base de Datos:** PostgreSQL 15+ (con soporte JSONB para auditoría).
- **Flujo de Procesos:** Actualizado para reflejar el rol del **Tomador de Tiempos** (registro masivo de 10-20 operarios).
- **Capacidad Offline:** Implementación de Service Workers (Workbox) e IndexedDB (Dexie.js) para operación sin internet.

### Añadido
- **Especificación de Stack v2.0:** Nuevo documento detallando la selección tecnológica.
- **Arquitectura v2.0:** Documento MD complementario al PDF original.
- **Dockerización:** Configuración de servicios mediante Docker Compose (Frontend, Backend, DB).
- **Controles de Auditoría:** Registro de IP, User Agent y marcas de sincronización (ALCOA+).
- **Doble Método de Identificación:**
  - **Opción 1 (Rápida):** Escaneo QR del uniforme/gafete para captura automática.
  - **Opción 2 (Alternativa):** Búsqueda manual por nombre o gafete para casos donde el QR esté dañado.
- **LOVABLE_SPECS.md:** Especificaciones completas para prototipado rápido en Lovable con mockups ASCII y datos de prueba.

### Mejorado
- **Interfaz de Usuario:** Optimización para tablets con botones de mínimo 48x48px y tipografía legible (>16px).
- **Rendimiento:** Reducción de latencia en reportes (<10s) mediante optimización de índices en PostgreSQL.
- **Identidad Visual:** Aplicación de colores institucionales Pharmadix en toda la interfaz:
  - **#410468** Morado corporativo (color principal en headers, logo, botones primarios)
  - **#009FE3** Azul (botones informativos)
  - **#00A651** Verde (botones ENTRADA, confirmaciones)
  - **#F15A29** Naranja (botones SALIDA, advertencias)

---

## [1.0.0] - 2026-01-15

### Inicial
- Análisis de requisitos funcionales y no funcionales.
- Diseño inicial de base de datos relacional.
- Definición de flujo AS-IS (manual) y TO-BE (digital básico).
- Informe ejecutivo de digitalización.
