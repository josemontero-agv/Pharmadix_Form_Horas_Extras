# Especificación de Stack Tecnológico v2.0 - Pharmadix

Este documento detalla la selección tecnológica para la modernización del Sistema de Gestión de Tiempos Pharmadix, migrando hacia una arquitectura **PWA (Progressive Web App)** profesional y escalable.

## 1. Justificación de la Arquitectura PWA

Se ha seleccionado el modelo **PWA** sobre el desarrollo nativo (Kotlin/Swift) o híbrido (React Native) por las siguientes razones críticas para Pharmadix:

- **Despliegue Instantáneo:** Las actualizaciones son inmediatas para todos los operarios al recargar la página, eliminando el proceso de aprobación en tiendas.
- **Offline-First:** Mediante Service Workers e IndexedDB, la app funciona en zonas de la planta con WiFi inestable.
- **Bajo Costo de Mantenimiento:** Un solo código base escrito en tecnologías web estándar para todos los dispositivos (Android/iOS/PC).
- **Inmersividad:** Permite "instalar" la app en la pantalla de inicio de la tablet, funcionando a pantalla completa y con acceso a la cámara para escaneo QR.

## 2. Comparativa Tecnológica

| Criterio | PWA (Seleccionado) | React Native / Híbrido | Nativo (Android/iOS) |
| :--- | :--- | :--- | :--- |
| **Tiempo de Desarrollo** | Bajo (3 meses) | Medio (4-5 meses) | Alto (6+ meses) |
| **Capacidades Offline** | Excelentes (Service Workers) | Muy Buenas | Nativas |
| **Costo de Licencias** | $0 | $0 | $198/año (Apple + Google) |
| **Facilidad de Uso** | Muy Alta (URL única) | Media (Instalación App) | Media (Instalación App) |
| **Curva de Aprendizaje** | Baja (Web) | Media (Mobile APIs) | Muy Alta |

## 3. Detalle del Stack Propuesto

### Frontend (Captura en Planta y Admin)
- **Framework:** React 18 + TypeScript (Vite como bundler para velocidad).
- **Estilos:** Tailwind CSS + shadcn/ui (componentes profesionales y accesibles).
- **Gestión de Estado:** Zustand (ligero y simple para operarios).
- **Persistencia Local:** Dexie.js (wrapper de IndexedDB para almacenamiento offline de lotes y empleados).
- **Sincronización:** Workbox para gestión de Service Workers y estrategias de caché.
- **QR:** `html5-qrcode` para lectura rápida usando la cámara de la tablet.

### Backend (API de Servicios)
- **Runtime:** Node.js (LTS).
- **Framework:** Fastify (preferido por su alto rendimiento de hasta 50 tx/s) o Express.
- **ORM:** Prisma (Type-safe, reduce errores en base de datos).
- **Validación:** Zod (para asegurar integridad de datos desde el frontend).
- **Seguridad:** JWT (JSON Web Tokens) con políticas de rotación de tokens.

### Base de Datos
- **Motor:** PostgreSQL 15+.
- **Auditoría:** Tablas de logs con JSONB para trazabilidad ALCOA+.
- **Rendimiento:** Índices B-Tree en columnas de búsqueda frecuente (lote, gafete).

## 4. Configuración de Entornos

| Entorno | Propósito | Infraestructura |
| :--- | :--- | :--- |
| **Desarrollo** | Codificación diaria | Docker local (Compose) |
| **Staging** | Pruebas con operarios | Servidor de pruebas interno |
| **Producción** | Uso real en planta | Servidor local Pharmadix (On-premise) |

## 5. Estrategia de Implementación (Docker)

Se utilizará **Docker Compose** para orquestar los tres servicios principales:
1. `frontend`: Servido vía Nginx.
2. `backend`: API Node.js.
3. `database`: Instancia persistente de PostgreSQL.

---
**Ultima Actualización:** 2026-01-27
**Autor:** AI Assistant
