export type EstadoIncidencia = 'pendiente' | 'en_proceso' | 'resuelto';

export interface Incidencia {
  id: string;
  titulo: string;
  servicio: string;
  descripcion: string;
  estado: EstadoIncidencia;
  fecha: string;
}

export const incidenciasMock: Incidencia[] = [
  {
    id: '1',
    titulo: 'Sin agua caliente',
    servicio: "Agua",
    descripcion: 'Desde la mañana',
    estado: 'en_proceso',
    fecha: '2026-04-23',
  },
  {
    id: '2',
    titulo: 'Luz del pasillo rota',
    servicio: "Electricidad",
    descripcion: 'No enciende',
    estado: 'pendiente',
    fecha: '2026-04-22',
  },
  {
    id: '3',
    titulo: 'Ascensor fuera de servicio',
    servicio: "Electricidad",
    descripcion: 'No responde',
    estado: 'resuelto',
    fecha: '2026-04-20',
  },
];