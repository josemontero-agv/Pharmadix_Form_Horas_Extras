# Pharmadix Times v2.0 🚀

Sistema de Gestión de Tiempos y Horas Hombre optimizado para la planta de producción de **Pharmadix Corp. S.A.**

## 📋 Descripción del Proyecto

Pharmadix Times es una **PWA (Progressive Web App)** diseñada para modernizar el control de tiempos en planta. Reemplaza el registro manual en papel por una solución digital táctil, segura y con capacidades offline.

### ✨ Características Principales
- **Escaneo QR:** Identificación instantánea de operarios mediante cámara.
- **Modo Offline-First:** Sincronización automática de datos cuando hay conexión.
- **Validación de Lotes:** Control inteligente de estados (Abierto/Cerrado).
- **Cumplimiento ALCOA+:** Trazabilidad total de registros y firmas digitales.
- **Reportería:** Dashboards en tiempo real de eficiencia y costos.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, TypeScript, Vite.
- **UI/UX:** Tailwind CSS, shadcn/ui.
- **Iconos:** Lucide React, Bootstrap Icons.
- **Hardware:** html5-qrcode (Acceso a cámara).
- **Almacenamiento:** Browser LocalStorage / IndexedDB.

---

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js (v18 o superior)
- npm o bun

### Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Entra en la carpeta del frontend:
   ```bash
   cd frontend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

### Ejecución en Desarrollo
Inicia el servidor local:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:8080` (o el siguiente puerto libre).

---

## 📂 Estructura del Proyecto

```text
├── Documentacion_Realizada/   # Portal de documentación HTML y técnicos
├── docs/                      # Manuales en formato Markdown
├── frontend/                  # Código fuente de la aplicación React
│   ├── src/
│   │   ├── components/        # Componentes UI y lógica de negocio
│   │   ├── pages/             # Pantallas principales
│   │   ├── data/              # Mocks y data maestra
│   │   └── types/             # Definiciones TypeScript
└── image/                     # Recursos visuales y logotipos
```

---

## 📖 Documentación Complementaria

Para una guía detallada, accede al **Centro de Documentación Web**:
Abre `Documentacion_Realizada/Referencia_Documentacion/index.html` en tu navegador.

---

## 👥 Contribución y Desarrollo

Consulta el `CHANGELOG.md` para ver el historial de cambios y `docs/MANUAL_DESARROLLADOR.md` para pautas de desarrollo.

© 2026 Pharmadix Corp. S.A. | Todos los derechos reservados.
