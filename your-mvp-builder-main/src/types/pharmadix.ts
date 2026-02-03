// Pharmadix Types

export interface Empleado {
  id: string;
  gafete: string;
  nombre: string;
  puesto: string;
  foto: string;
  activo: boolean;
}

export interface Lote {
  id: string;
  numero: string;
  producto: string;
  presentacion: string;
  proceso: string;
  area: string;
  cantidadOrdenada: number;
  estado: 'ABIERTO' | 'CERRADO';
  fechaInicio: string;
}

export interface Actividad {
  id: string;
  nombre: string;
}

export type EstadoRegistro = 'PENDIENTE' | 'EN_PROCESO' | 'FINALIZADO';

export interface RegistroTiempo {
  id: string;
  empleadoId: string;
  empleado?: Empleado;
  actividad: string;
  horaEntrada: string | null;
  horaSalida: string | null;
  horasTotales: number | null;
  estado: EstadoRegistro;
}

export type EstadoHoja = 'BORRADOR' | 'CERRADA' | 'APROBADA';
export type Turno = 'MAÑANA' | 'TARDE' | 'NOCHE';

export interface HojaTiempo {
  id: string;
  numeroHoja: number;
  loteId: string;
  lote?: Lote;
  tomadorId: string;
  fechaEmision: string;
  turno: Turno;
  estado: EstadoHoja;
  registros: RegistroTiempo[];
  firmaBase64: string | null;
  sincronizada: boolean;
}

export type ConnectionStatus = 'online' | 'offline' | 'syncing';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'TOMADOR' | 'SUPERVISOR' | 'ADMIN';
}
