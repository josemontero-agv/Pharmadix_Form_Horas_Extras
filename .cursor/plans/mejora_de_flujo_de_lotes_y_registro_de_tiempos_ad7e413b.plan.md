---
name: Mejora de Flujo de Lotes y Registro de Tiempos
overview: Optimización del flujo de trabajo para el ingreso de lotes multi-campo, implementación de una máquina de estados para el registro de entrada/salida de operarios, y establecimiento del proceso de doble confirmación entre Tomador y Jefe de Manufactura.
todos:
  - id: update_lovable_specs_ux
    content: Actualizar LOVABLE_SPECS.md con la lógica de botones contextuales (Entrada/Salida) y el nuevo formulario de Lote multi-campo.
    status: completed
  - id: update_flow_confirmations
    content: Modificar Flujo_Procesos_Pharmadix.md para incluir el flujo de doble confirmación (Tomador + Jefe) y la máquina de estados del operario.
    status: completed
  - id: update_tech_arch_states
    content: Ajustar Arquitectura_Diseno_Tecnico_v2.md con los nuevos campos de auditoría y lógica de estados.
    status: completed
  - id: update_changelog_v21
    content: Registrar versión v2.1.0 en CHANGELOG.md detallando las mejoras de rendimiento y UX.
    status: completed
  - id: todo-1770048501621-61uc52klr
    content: Necesito que puedas crear un sistema de logs de accion, si alguien inicio sesion, si creo un formulario, quien lo hizo y etc. Todo esto para mantener un historial y trazabilidad
    status: pending
isProject: false
---

# Plan de Mejora: Gestión de Lotes y Flujo de Tiempos v2.1

Este plan aborda las inconsistencias detectadas en el MVP y alinea la aplicación con los requisitos de `Horas extras Pharmadix.pdf`.

## 1. Rediseño del Ingreso de Lotes (Contexto Global)

La aplicación ahora permitirá crear o seleccionar un lote con los siguientes campos obligatorios en una sola vista:

- **Número de Lote** (Búsqueda predictiva o nuevo ingreso)
- **Producto**
- **Presentación**
- **Proceso** (Selección de catálogo)
- **Área de Producción** (Selección de catálogo)
- **Cantidad Ordenada**

### Optimización de Base de Datos:

- **Índices Compuestos:** Se creará un índice en `(lote_numero, area, estado)` para búsquedas rápidas.
- **Cache de Catálogos:** Áreas, procesos y productos se cargarán en `IndexedDB` al inicio para evitar latencia.

## 2. Máquina de Estados para Operarios (UX Inteligente)

Para resolver la inconsistencia de los botones, se implementará la siguiente lógica:

| Estado Actual | Acción en UI | Evento | Nuevo Estado |
| :--- | :--- | :--- | :--- |
| **No Registrado** | Botón **ENTRADA** | Click Entrada | **EN PROCESO** (Guarda `hora_entrada`) |
| **EN PROCESO** | Botón **SALIDA** | Click Salida | **FINALIZADO** (Guarda `hora_salida`) |
| **FINALIZADO** | Solo lectura | - | - |

### Mejoras en la Interfaz:

- **Botón Contextual:** El sistema detectará automáticamente si el operario ya tiene una entrada abierta. Si es así, al escanearlo o seleccionarlo, solo mostrará el botón de **SALIDA**.
- **Acceso Directo desde Lista:** Al tocar un operario en la lista que esté "EN PROCESO", se abrirá directamente la opción para marcar su **SALIDA**.

## 3. Flujo de Doble Confirmación (Cumplimiento)

Se establece el proceso de cierre de hoja en dos pasos:

1. **Confirmación 1 (Tomador de Tiempos):** 

- Al terminar el turno, el Tomador revisa la lista.
- Firma digitalmente (Canvas).
- Estado de la hoja: `POR_APROBAR`.

2. **Confirmación 2 (Jefe de Manufactura):**

- El Jefe accede a la Web Admin o PWA (vista Admin).
- Revisa totales y firma digitalmente.
- Estado de la hoja: `APROBADA`.
- Solo en este estado los datos se consideran finales para nómina/costos.

## 4. Actualización de Documentación

Se realizarán los siguientes cambios en los archivos:

### [LOVABLE_SPECS.md](LOVABLE_SPECS.md)

- Actualizar el **Prompt para Lovable** con la lógica de botones contextuales.
- Modificar el mockup de la **Ficha de Operario** para que sea dinámica.
- Agregar el flujo de **Ingreso de Lote Multi-campo**.
- Incluir la lógica de **Doble Confirmación**.

### [Flujo_Procesos_Pharmadix.md](Documentacion_Realizada/Flujo_Procesos_Pharmadix.md)

- Rediseñar el diagrama de secuencia de **Cierre y Sincronización** para incluir la aprobación del Jefe de Manufactura.
- Actualizar el diagrama de **Registro de Operario** con la validación de estado (Entrada/Salida).

### [Arquitectura_Diseno_Tecnico_v2.md](Documentacion_Realizada/Arquitectura_Diseno_Tecnico_v2.md)

- Especificar el cambio en la lógica de negocio (Backend y Frontend) para manejar los estados del operario.
- Detallar los nuevos campos de la tabla `HOJAS_TIEMPO` para soportar las dos firmas.

## 5. Historial de Logs (CHANGELOG.md)

Se agregará la versión **v2.1.0** detallando estas mejoras críticas de UX y negocio.