# Sistema de Registro de Tiempo - Pharmadix

Sistema MVP para registro de distribución de tiempo desarrollado en Google Apps Script.

## 📁 Archivos del Proyecto

- **Code.gs**: Código backend de Google Apps Script con todas las funciones del servidor
- **index.html**: Interfaz de usuario con diseño moderno e intuitivo
- **appsscript.json**: Configuración del proyecto Apps Script

## 🚀 Instrucciones de Instalación

### Paso 1: Crear el Proyecto en Google Apps Script

1. Ve a [script.google.com](https://script.google.com)
2. Haz clic en **"Nuevo proyecto"**
3. Elimina el código predeterminado

### Paso 2: Subir los Archivos

1. **Code.gs**: 
   - Copia todo el contenido de `Code.gs`
   - Pégalo en el editor de Apps Script (ya debería estar abierto Code.gs)

2. **index.html**:
   - En el editor de Apps Script, haz clic en **"+"** junto a "Archivos"
   - Selecciona **"HTML"**
   - Nómbralo `index`
   - Copia y pega el contenido de `index.html`

3. **appsscript.json** (Opcional):
   - Ve a **Ver > Mostrar archivo de manifiesto**
   - Copia el contenido de `appsscript.json` en el archivo `appsscript.json` que aparece

### Paso 3: Crear la Hoja de Cálculo

1. Crea una nueva **Google Sheet** (hoja de cálculo)
2. El script creará automáticamente las hojas necesarias cuando se ejecute por primera vez
3. **Importante**: Asocia el script a esta hoja de cálculo:
   - En el editor de Apps Script, ve a **Extensiones > Apps Script**
   - O simplemente guarda el script y luego abre la hoja de cálculo

### Paso 4: Configurar como Aplicación Web

1. En el editor de Apps Script, haz clic en **"Implementar" > "Nueva implementación"**
2. Selecciona **"Tipo: Aplicación web"**
3. Configura:
   - **Descripción**: "Sistema de Registro de Tiempo"
   - **Ejecutar como**: "Yo"
   - **Quién tiene acceso**: "Cualquiera"
4. Haz clic en **"Implementar"**
5. **Copia la URL de la aplicación web** que se genera

### Paso 5: Actualizar la URL en index.html

1. Abre el archivo `index.html` en el editor de Apps Script
2. Busca la línea que dice: `const scriptUrl = 'TU_URL_DE_APPS_SCRIPT_AQUI';`
3. Reemplaza `'TU_URL_DE_APPS_SCRIPT_AQUI'` con la URL que copiaste en el Paso 4
4. Guarda el archivo

### Paso 6: Crear Usuarios de Prueba

1. En el editor de Apps Script, selecciona la función `crearUsuarioPrueba` en el menú desplegable
2. Haz clic en **"Ejecutar"** (▶️)
3. Autoriza los permisos si es necesario
4. Esto creará 3 usuarios de prueba:
   - **Usuario**: `jperez` | **Contraseña**: `1234` | **Rol**: Operario
   - **Usuario**: `mgarcia` | **Contraseña**: `1234` | **Rol**: Supervisor
   - **Usuario**: `clopez` | **Contraseña**: `1234` | **Rol**: Administrador

## 📊 Estructura de Base de Datos

### Hoja "Usuarios"
- Nombre Completo
- Usuario
- Contraseña
- Area
- Cargo
- Rol

### Hoja "Registros"
- Nombre
- Usuario
- Area
- Cargo
- Fecha Entrada
- Hora Entrada
- Fecha Salida
- Hora Salida
- Tiempo Laboral (calculado automáticamente)

## 🎯 Funcionalidades

### Para Operarios:
- ✅ Login con usuario y contraseña
- ✅ Registro de tiempo de entrada y salida
- ✅ Botones para marcar entrada/salida automáticamente
- ✅ Visualización de sus propios registros
- ✅ Interfaz intuitiva y fácil de usar

### Para Supervisores y Administradores:
- ✅ Todas las funcionalidades de operarios
- ✅ Visualización de todos los registros (no solo los propios)
- ✅ Reportes completos del equipo

## 🎨 Características de Diseño

- Diseño moderno con gradientes y animaciones
- Interfaz responsive (funciona en móviles, tablets y escritorio)
- Reloj en tiempo real
- Iconos de Font Awesome
- Colores intuitivos y atractivos

## 🔧 Tecnologías Utilizadas

- **Backend**: Google Apps Script (JavaScript)
- **Frontend**: HTML5, CSS3, JavaScript
- **Frameworks CDN**:
  - Bootstrap 5.3.0
  - jQuery 3.7.0
  - Font Awesome 6.4.0
  - Google Fonts (Poppins)

## 📝 Notas Importantes

1. **Seguridad**: Las contraseñas se almacenan en texto plano. Para producción, considera implementar hash de contraseñas.

2. **Permisos**: La primera vez que ejecutes el script, Google te pedirá autorización para acceder a tu hoja de cálculo.

3. **URL de la App**: Cada vez que actualices el código, necesitarás crear una nueva versión de la implementación para que los cambios se reflejen.

4. **Zona Horaria**: Configurada para "America/Mexico_City". Puedes cambiarla en `appsscript.json` si es necesario.

## 🐛 Solución de Problemas

- **Error "No se puede acceder a la hoja"**: Asegúrate de que el script esté asociado a una hoja de cálculo
- **Error de conexión**: Verifica que la URL en `index.html` sea correcta y que la aplicación web esté desplegada
- **No aparecen las hojas**: Ejecuta la función `crearUsuarioPrueba` para inicializar las hojas

## 📞 Soporte

Para cualquier duda o problema, revisa los logs en el editor de Apps Script: **Ver > Registros de ejecución**
