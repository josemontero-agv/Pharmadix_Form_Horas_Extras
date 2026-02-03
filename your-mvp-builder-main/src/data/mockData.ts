import { Empleado, Lote, Actividad } from '@/types/pharmadix';

export const empleados: Empleado[] = [
  {
    id: 'EMP-001',
    gafete: '1234',
    nombre: 'Juan Carlos Pérez',
    puesto: 'Operario de Envasado',
    foto: 'https://i.pravatar.cc/150?img=11',
    activo: true,
  },
  {
    id: 'EMP-002',
    gafete: '5678',
    nombre: 'María Elena López',
    puesto: 'Operaria de Etiquetado',
    foto: 'https://i.pravatar.cc/150?img=47',
    activo: true,
  },
  {
    id: 'EMP-003',
    gafete: '9012',
    nombre: 'Carlos Alberto García',
    puesto: 'Operario de Empaque',
    foto: 'https://i.pravatar.cc/150?img=13',
    activo: true,
  },
  {
    id: 'EMP-004',
    gafete: '3456',
    nombre: 'Ana Patricia Martínez',
    puesto: 'Operaria de Control de Calidad',
    foto: 'https://i.pravatar.cc/150?img=44',
    activo: true,
  },
  {
    id: 'EMP-005',
    gafete: '7890',
    nombre: 'Roberto Hernández',
    puesto: 'Operario de Limpieza',
    foto: 'https://i.pravatar.cc/150?img=15',
    activo: true,
  },
  {
    id: 'EMP-006',
    gafete: '2345',
    nombre: 'Laura Sánchez',
    puesto: 'Operaria de Envasado',
    foto: 'https://i.pravatar.cc/150?img=48',
    activo: true,
  },
  {
    id: 'EMP-007',
    gafete: '6789',
    nombre: 'Miguel Ángel Torres',
    puesto: 'Operario de Etiquetado',
    foto: 'https://i.pravatar.cc/150?img=17',
    activo: true,
  },
  {
    id: 'EMP-008',
    gafete: '0123',
    nombre: 'Fernanda Ruiz',
    puesto: 'Operaria de Empaque',
    foto: 'https://i.pravatar.cc/150?img=49',
    activo: true,
  },
  {
    id: 'EMP-009',
    gafete: '4567',
    nombre: 'José Luis Flores',
    puesto: 'Operario de Control de Calidad',
    foto: 'https://i.pravatar.cc/150?img=19',
    activo: true,
  },
  {
    id: 'EMP-010',
    gafete: '8901',
    nombre: 'Gabriela Moreno',
    puesto: 'Operaria de Limpieza',
    foto: 'https://i.pravatar.cc/150?img=50',
    activo: true,
  },
];

export const lotes: Lote[] = [
  {
    id: 'LOTE-001',
    numero: '12345',
    producto: 'Paracetamol 500mg',
    presentacion: 'Tabletas',
    proceso: 'Envasado',
    area: 'Línea 1',
    cantidadOrdenada: 50000,
    estado: 'ABIERTO',
    fechaInicio: '2026-01-27T08:00:00Z',
  },
  {
    id: 'LOTE-002',
    numero: '67890',
    producto: 'Ibuprofeno 400mg',
    presentacion: 'Cápsulas',
    proceso: 'Etiquetado',
    area: 'Línea 2',
    cantidadOrdenada: 30000,
    estado: 'ABIERTO',
    fechaInicio: '2026-01-27T08:00:00Z',
  },
  {
    id: 'LOTE-003',
    numero: '11223',
    producto: 'Amoxicilina 250mg',
    presentacion: 'Suspensión',
    proceso: 'Empaque',
    area: 'Línea 3',
    cantidadOrdenada: 20000,
    estado: 'ABIERTO',
    fechaInicio: '2026-01-28T08:00:00Z',
  },
];

export const actividades: Actividad[] = [
  { id: 'ACT-01', nombre: 'Envasado' },
  { id: 'ACT-02', nombre: 'Etiquetado' },
  { id: 'ACT-03', nombre: 'Empaque' },
  { id: 'ACT-04', nombre: 'Limpieza' },
  { id: 'ACT-05', nombre: 'Control de Calidad' },
];

export const procesos = [
  'Envasado',
  'Etiquetado',
  'Empaque',
  'Acondicionamiento',
  'Control de Calidad',
];

export const areas = [
  'Línea 1',
  'Línea 2',
  'Línea 3',
  'Área de Empaque',
  'Almacén',
];

export const turnos = [
  { id: 'MAÑANA', nombre: 'Mañana (06:00 - 14:00)' },
  { id: 'TARDE', nombre: 'Tarde (14:00 - 22:00)' },
  { id: 'NOCHE', nombre: 'Noche (22:00 - 06:00)' },
];
