// features/incidencias/incidencia.store.ts
// ─── Reemplaza mock.ts por completo ──────────────────────────────────────────

import { create } from 'zustand';

// ─── Tipos públicos ────────────────────────────────────────────────────────────
export type EstadoIncidencia    = 'pendiente' | 'en_proceso' | 'resuelto';
export type PrioridadIncidencia = 'baja' | 'media' | 'alta' | 'critica';

export interface Comentario {
  id:        string;
  autor:     string;           // nombre a mostrar
  rol:       'admin' | 'vecino';
  texto:     string;
  fecha:     string;           // ISO 8601
  avatarUrl?: string;          // URL o asset local (opcional)
}

export interface Incidencia {
  id:                  string;
  titulo:              string;
  servicio:            string;
  descripcion:         string;
  estado:              EstadoIncidencia;
  prioridad:           PrioridadIncidencia;
  fecha:               string;        // ISO 8601
  fechaActualizacion?: string;
  imagen?:             string | null; // URI local o URL remota
  comentarios?:        Comentario[];
}

// NuevaIncidencia: lo que el usuario completa en el form
// comentarios se omite porque se agrega después, no al crear
export type NuevaIncidencia = Omit<
  Incidencia,
  'id' | 'fecha' | 'estado' | 'fechaActualizacion' | 'comentarios'
>;

// ─── Colores compartidos ──────────────────────────────────────────────────────
export const COLORS = {
  bg:          '#f8fafc',
  surface:     '#ffffff',
  surfaceHigh: '#f1f5f9',
  accent:      '#3b82f6',
  accentSoft:  '#2563eb',
  pendiente:   '#f59e0b',
  en_proceso:  '#3b82f6',
  resuelto:    '#10b981',
  danger:      '#ef4444',
  textPrimary:   '#0f172a',
  textSecondary: '#475569',
  textMuted:     '#94a3b8',
  border:        '#e2e8f0',
} as const;

export const ESTADO_META: Record<EstadoIncidencia, { color: string; label: string; icon: string }> = {
  pendiente:  { color: COLORS.pendiente,  label: 'Pendiente',  icon: 'time-outline'             },
  en_proceso: { color: COLORS.en_proceso, label: 'En proceso', icon: 'sync-outline'             },
  resuelto:   { color: COLORS.resuelto,   label: 'Resuelto',   icon: 'checkmark-circle-outline' },
};

export const PRIORIDAD_META: Record<PrioridadIncidencia, { color: string; label: string; icon: string }> = {
  baja:    { color: COLORS.resuelto,      label: 'Baja',    icon: 'arrow-down-outline' },
  media:   { color: COLORS.textSecondary, label: 'Media',   icon: 'remove-outline'     },
  alta:    { color: COLORS.pendiente,     label: 'Alta',    icon: 'arrow-up-outline'   },
  critica: { color: COLORS.danger,        label: 'Crítica', icon: 'flame-outline'      },
};

export const SERVICIOS = [
  'Agua', 'Electricidad', 'Gas', 'Ascensor',
  'Seguridad', 'Limpieza', 'Estructura', 'Internet', 'Otro',
] as const;

// ─── Datos iniciales ──────────────────────────────────────────────────────────
const DATA_INICIAL: Incidencia[] = [
  {
    id: '1',
    titulo: 'Sin agua caliente',
    servicio: 'Agua',
    descripcion: 'Desde la mañana no hay agua caliente en todo el edificio. Varios vecinos reportaron el problema.',
    estado: 'en_proceso',
    prioridad: 'alta',
    fecha: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    comentarios: [
      {
        id: 'c1',
        autor: 'Administración',
        rol: 'admin',
        texto: 'Recibimos el reporte. Ya contactamos al técnico de turno, estará en el edificio a la brevedad.',
        fecha: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
  },
  {
    id: '2',
    titulo: 'Luz del pasillo rota',
    servicio: 'Electricidad',
    descripcion: 'La luz del pasillo del piso 3 no enciende. Ya se cambió la bombilla y sigue sin funcionar.',
    estado: 'pendiente',
    prioridad: 'media',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: '3',
    titulo: 'Ascensor fuera de servicio',
    servicio: 'Ascensor',
    descripcion: 'El ascensor principal no responde. El técnico ya fue avisado.',
    estado: 'resuelto',
    prioridad: 'critica',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    fechaActualizacion: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    comentarios: [
      {
        id: 'c2',
        autor: 'Administración',
        rol: 'admin',
        texto: 'El ascensor fue reparado y ya se encuentra operativo. Gracias por el aviso.',
        fecha: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  },
  {
    id: '4',
    titulo: 'Pérdida de gas en planta baja',
    servicio: 'Gas',
    descripcion: 'Se detectó olor a gas en la entrada del edificio. Se cortó el suministro preventivamente.',
    estado: 'en_proceso',
    prioridad: 'critica',
    fecha: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: '5',
    titulo: 'Cámara de seguridad sin imagen',
    servicio: 'Seguridad',
    descripcion: 'La cámara del estacionamiento subterráneo dejó de transmitir imagen.',
    estado: 'pendiente',
    prioridad: 'alta',
    fecha: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
];

// ─── Store ────────────────────────────────────────────────────────────────────
interface IncidenciaState {
  incidencias:    Incidencia[];
  loading:        boolean;
  error:          string | null;

  addIncidencia:    (data: NuevaIncidencia) => void;
  updateEstado:     (id: string, estado: EstadoIncidencia) => void;
  deleteIncidencia: (id: string) => void;
  addComentario:    (incidenciaId: string, comentario: Omit<Comentario, 'id' | 'fecha'>) => void;
  setLoading:       (v: boolean) => void;
  setError:         (v: string | null) => void;
}

export const useIncidenciaStore = create<IncidenciaState>((set) => ({
  incidencias: DATA_INICIAL,
  loading:     false,
  error:       null,

  addIncidencia: (data) =>
    set((state) => ({
      incidencias: [
        {
          ...data,
          id:          Date.now().toString(),
          estado:      'pendiente' as EstadoIncidencia,
          fecha:       new Date().toISOString(),
          comentarios: [],
        },
        ...state.incidencias,
      ],
    })),

  updateEstado: (id, estado) =>
    set((state) => ({
      incidencias: state.incidencias.map((i) =>
        i.id === id ? { ...i, estado, fechaActualizacion: new Date().toISOString() } : i
      ),
    })),

  deleteIncidencia: (id) =>
    set((state) => ({
      incidencias: state.incidencias.filter((i) => i.id !== id),
    })),

  addComentario: (incidenciaId, comentario) =>
    set((state) => ({
      incidencias: state.incidencias.map((i) =>
        i.id === incidenciaId
          ? {
              ...i,
              comentarios: [
                ...(i.comentarios ?? []),
                { ...comentario, id: Date.now().toString(), fecha: new Date().toISOString() },
              ],
            }
          : i
      ),
    })),

  setLoading: (loading) => set({ loading }),
  setError:   (error)   => set({ error }),
}));
