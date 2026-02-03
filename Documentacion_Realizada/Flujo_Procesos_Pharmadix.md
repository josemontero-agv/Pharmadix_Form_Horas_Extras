# Flujo de Procesos - Digitalización de Tiempos Pharmadix v2.0

Este documento sintetiza el flujo de procesos basado en la arquitectura **PWA (Progressive Web App)**:

- [Arquitectura y Diseño Técnico v2.0](file:///c%3A/Users/jmontero/Desktop/GitHub%20Proyectos_AGV/Pharmadix_Form_Horas_Extras/Documentacion_Realizada/Arquitectura_Diseno_Tecnico_v2.md)
- [Especificación de Stack Tecnológico v2.0](file:///c%3A/Users/jmontero/Desktop/GitHub%20Proyectos_AGV/Pharmadix_Form_Horas_Extras/Documentacion_Realizada/Stack_Tecnologico_v2.md)

## Actores y Sistemas

- **Tomador de Tiempos:** Operario encargado de registrar los tiempos de su equipo (10-20 personas).
- **PWA Frontend:** Aplicación web profesional con capacidades offline.
- **Service Worker:** Componente que gestiona la caché y sincronización en segundo plano.
- **Backend API:** API de alto rendimiento (Fastify/Node.js).
- **Base de Datos:** PostgreSQL 15+.

## Flujo TO-BE (Digital con PWA)

### 1) Inicio de Sesión e Ingreso de Lote

El Tomador de Tiempos registra los datos completos del lote.

```mermaid
sequenceDiagram
    participant TT as Tomador de Tiempos
    participant PWA as PWA App
    participant SW as Service Worker
    
    TT->>PWA: Inicia Nueva Hoja
    
    rect rgb(240, 240, 240)
        Note over TT, PWA: Ingreso de Datos del Lote
        TT->>PWA: Ingresa/Escanea Número de Lote
        PWA->>SW: Busca Lote en Caché
        alt Lote Existente
            SW-->>PWA: Autocompleta Producto, Presentación, etc.
        else Nuevo Lote
            TT->>PWA: Selecciona Producto y Presentación
            TT->>PWA: Selecciona Proceso y Área
            TT->>PWA: Ingresa Cantidad Ordenada
        end
    end
    
    TT->>PWA: Confirma creación de hoja
```

### 2) Registro Masivo con Validación de Estado

El sistema gestiona inteligentemente si es entrada o salida.

```mermaid
sequenceDiagram
    participant TT as Tomador de Tiempos
    participant PWA as PWA App
    participant IDB as IndexedDB (Local)
    
    loop Por cada operario
        TT->>PWA: Identifica Operario (QR o Manual)
        PWA->>IDB: Consulta estado actual en esta hoja
        
        alt Estado: NO REGISTRADO
            IDB-->>PWA: Estado = PENDIENTE
            PWA-->>TT: Muestra Botón Verde "ENTRADA"
            TT->>PWA: Clic Entrada -> Guarda Hora Inicio
        else Estado: EN PROCESO
            IDB-->>PWA: Estado = EN_PROCESO
            PWA-->>TT: Muestra Botón Naranja "SALIDA"
            TT->>PWA: Clic Salida -> Guarda Hora Fin y Calcula Total
        else Estado: FINALIZADO
            PWA-->>TT: Muestra Resumen (Solo Lectura)
        end
        
        PWA->>IDB: Actualiza registro local
    end
```

### 3) Cierre con Doble Confirmación

Proceso de validación en dos pasos para asegurar la integridad de los datos.

```mermaid
sequenceDiagram
    participant TT as Tomador de Tiempos
    participant Jefe as Jefe Manufactura
    participant PWA as PWA App
    participant API as Backend API
    participant DB as Base de Datos
    
    Note over TT, PWA: Paso 1: Cierre Operativo
    TT->>PWA: Revisa totales y firma
    PWA->>API: Envía hoja (Estado: POR_APROBAR)
    API->>DB: INSERT HOJA
    
    Note over Jefe, API: Paso 2: Aprobación Administrativa
    Jefe->>PWA: Accede a Dashboard Admin
    PWA->>API: GET hojas pendientes
    Jefe->>PWA: Revisa hoja #12345
    Jefe->>PWA: Firma y Aprueba
    PWA->>API: UPDATE estado = APROBADA
    API->>DB: Commit final
```

## Flujo de Datos Online vs Offline

```mermaid
flowchart TD
    A[Captura de Datos en Tablet] --> B{¿Hay Internet?}
    B -- Sí --> C[Envío inmediato vía API]
    C --> D[Confirmación en Tiempo Real]
    B -- No --> E[Guardar en IndexedDB]
    E --> F[Service Worker detecta red]
    F --> G[Sincronización en Segundo Plano]
    G --> C
```

## Reportería y Auditoría ALCOA+

1. **Dashboard en Tiempo Real:** Visualización inmediata de costos y eficiencia.
2. **Trazabilidad:** Cada registro incluye sello de tiempo, ID del tomador, IP y User Agent.
3. **Integridad:** Validaciones en frontend y backend aseguran que no haya traslapes de horarios.

## Resultados Esperados v2.0

- **Cero Papel:** Eliminación total de tarjetas físicas.
- **Eficiencia en Captura:** Registro masivo optimizado para tablets.
- **Robustez:** Operación continua incluso en fallas de red.
- **Escalabilidad:** Arquitectura preparada para 50+ transacciones por segundo.
