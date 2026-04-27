export type EstadoIncidencia = 'pendiente' | 'en_proceso' | 'resuelto';

export interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoIncidencia;
  fecha: string;
}

export const incidenciasMock: Incidencia[] = [
  {
    id: '1',
    titulo: 'Sin agua caliente',
    descripcion: 'Desde la mañana',
    estado: 'en_proceso',
    fecha: '2026-04-23',
  },
  {
    id: '2',
    titulo: 'Luz del pasillo rota',
    descripcion: 'No enciende',
    estado: 'pendiente',
    fecha: '2026-04-22',
  },
  {
    id: '3',
    titulo: 'Ascensor fuera de servicio',
    descripcion: 'No responde',
    estado: 'resuelto',
    fecha: '2026-04-20',
  },
];