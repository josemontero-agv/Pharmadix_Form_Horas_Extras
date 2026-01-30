// Configuración de la hoja de cálculo
const SPREADSHEET_ID = SpreadsheetApp.getActiveSpreadsheet().getId();
const SHEET_USUARIOS = 'Usuarios';
const SHEET_REGISTROS = 'BD_Registro';

// Esta función es obligatoria para que la aplicación web funcione y cargue el index.html
function doGet() {
  return HtmlService.createTemplateFromFile('index')
    .evaluate()
    .setTitle('Registro de Tiempo - Pharmadix')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// Función para obtener la hoja de usuarios
function getUsuariosSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_USUARIOS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_USUARIOS);
    sheet.appendRow(['Nombre Completo', 'Usuario', 'Contraseña', 'Area', 'Cargo', 'Rol']);
    sheet.getRange(1, 1, 1, 6).setFontWeight('bold');
  }
  return sheet;
}

// Función para obtener la hoja de registros
function getRegistrosSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_REGISTROS);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_REGISTROS);
    sheet.appendRow(['Nombre Completo', 'Usuario', 'Area', 'Cargo', 'Fecha de Inicio', 'Hora Entrada', 'Hora Salida', 'Tiempo Laboral', 'Turno']);
    sheet.getRange(1, 1, 1, 9).setFontWeight('bold');
  }
  return sheet;
}

// Función para autenticar usuario vía POST (Externo)
function doPost(e) {
  const action = e.parameter.action;
  let result;
  
  if (action === 'login') {
    result = login(e.parameter);
  } else if (action === 'registrarTiempo') {
    result = registrarTiempo(e.parameter);
  } else if (action === 'obtenerRegistros') {
    result = obtenerRegistros(e.parameter);
  } else if (action === 'obtenerUsuarioActual') {
    result = obtenerUsuarioActual(e.parameter);
  } else {
    result = JSON.stringify({success: false, message: 'Acción no válida'});
  }
  
  return ContentService.createTextOutput(result)
    .setMimeType(ContentService.MimeType.JSON);
}

// Función para autenticar
function login(params) {
  try {
    const usuario = params.usuario;
    const contraseña = params.contraseña;
    
    const sheet = getUsuariosSheet();
    const data = sheet.getDataRange().getValues();
    
    // Buscar usuario (empezar desde la fila 2, saltando el encabezado)
    for (let i = 1; i < data.length; i++) {
      if (data[i][1] === usuario && data[i][2] === contraseña) {
        const userData = {
          nombreCompleto: data[i][0],
          usuario: data[i][1],
          area: data[i][3],
          cargo: data[i][4],
          rol: data[i][5]
        };
        
        // Guardar sesión en PropertiesService
        const userKey = 'user_' + usuario;
        PropertiesService.getScriptProperties().setProperty(userKey, JSON.stringify(userData));
        
        return JSON.stringify({
          success: true,
          user: userData
        });
      }
    }
    
    return JSON.stringify({
      success: false,
      message: 'Usuario o contraseña incorrectos'
    });
    
  } catch (error) {
    return JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    });
  }
}

// Función para calcular el turno según la hora de entrada
function calcularTurno(horaStr) {
  if (!horaStr) return '';
  const hora = parseInt(horaStr.split(':')[0]);
  
  if (hora >= 6 && hora < 14) return 'Mañana';
  if (hora >= 14 && hora < 22) return 'Tarde';
  return 'Noche';
}

// Función para registrar tiempo
function registrarTiempo(params) {
  try {
    const sheet = getRegistrosSheet();
    const usuario = params.usuario;
    
    // Obtener datos del usuario
    const usuariosSheet = getUsuariosSheet();
    const usuariosData = usuariosSheet.getDataRange().getValues();
    let nombreCompleto = '';
    let area = '';
    let cargo = '';
    
    for (let i = 1; i < usuariosData.length; i++) {
      if (usuariosData[i][1] === usuario) {
        nombreCompleto = usuariosData[i][0];
        area = usuariosData[i][3];
        cargo = usuariosData[i][4];
        break;
      }
    }
    
    const fechaInicio = params.fechaEntrada;
    const horaEntrada = params.horaEntrada;
    const horaSalida = params.horaSalida || '';
    const turno = calcularTurno(horaEntrada);
    
    // Calcular tiempo laboral
    let tiempoLaboral = '';
    if (horaSalida) {
      // Usamos una fecha base para el cálculo de la diferencia de horas
      const entrada = new Date('2024-01-01 ' + horaEntrada);
      const salida = new Date('2024-01-01 ' + horaSalida);
      let diffMs = salida - entrada;
      
      // Si la salida es al día siguiente (ej. entrada 22:00, salida 02:00)
      if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000;
      
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      tiempoLaboral = diffHrs + 'h ' + diffMins + 'm';
    }
    
    // Agregar registro según estructura de la imagen
    sheet.appendRow([
      nombreCompleto, // A
      usuario,        // B
      area,           // C
      cargo,          // D
      fechaInicio,    // E (Fecha de Inicio)
      horaEntrada,    // F
      horaSalida,     // G
      tiempoLaboral,  // H
      turno           // I
    ]);
    
    return JSON.stringify({
      success: true,
      message: 'Registro guardado correctamente'
    });
    
  } catch (error) {
    return JSON.stringify({
      success: false,
      message: 'Error al guardar: ' + error.toString()
    });
  }
}

// Función para obtener registros según rol y filtros
function obtenerRegistros(params) {
  try {
    const usuario = params.usuario;
    const rol = params.rol;
    const horaDesde = params.horaDesde; // Opcional: "HH:mm"
    const horaHasta = params.horaHasta; // Opcional: "HH:mm"
    const turnoFiltro = params.turno;   // Opcional: "Mañana", "Tarde", "Noche"
    
    const sheet = getRegistrosSheet();
    const data = sheet.getDataRange().getValues();
    
    // Obtener encabezados
    const headers = data[0];
    
    // Filtrar registros
    let registros = [];
    for (let i = 1; i < data.length; i++) {
      const registro = {};
      headers.forEach((header, index) => {
        registro[header] = data[i][index];
      });
      
      // 1. Filtro por Rol (Operario solo ve lo suyo)
      if (rol === 'Operario' && registro['Usuario'] !== usuario) {
        continue;
      }
      
      // 2. Filtro por Turno
      if (turnoFiltro && registro['Turno'] !== turnoFiltro) {
        continue;
      }
      
      // 3. Filtro por Rango de Horas (comparación de strings "HH:mm")
      if (horaDesde || horaHasta) {
        const hEntrada = registro['Hora Entrada'];
        if (horaDesde && hEntrada < horaDesde) continue;
        if (horaHasta && hEntrada > horaHasta) continue;
      }
      
      registros.push(registro);
    }
    
    // Invertir para mostrar los más recientes primero
    registros.reverse();
    
    return JSON.stringify({
      success: true,
      registros: registros
    });
    
  } catch (error) {
    return JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    });
  }
}

// Función para obtener usuario actual
function obtenerUsuarioActual(params) {
  try {
    const usuario = params.usuario;
    const userKey = 'user_' + usuario;
    const userData = PropertiesService.getScriptProperties().getProperty(userKey);
    
    if (userData) {
      return JSON.stringify({
        success: true,
        user: JSON.parse(userData)
      });
    }
    
    return JSON.stringify({
      success: false,
      message: 'Usuario no encontrado'
    });
    
  } catch (error) {
    return JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    });
  }
}

// Función para crear usuario de prueba (ejecutar una vez)
function crearUsuarioPrueba() {
  const sheet = getUsuariosSheet();
  sheet.appendRow(['Juan Pérez', 'jperez', '1234', 'Producción', 'Operario', 'Operario']);
  sheet.appendRow(['María García', 'mgarcia', '1234', 'Calidad', 'Supervisor', 'Supervisor']);
  sheet.appendRow(['Carlos López', 'clopez', '1234', 'Administración', 'Gerente', 'Administrador']);
}
