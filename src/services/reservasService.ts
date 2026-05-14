// src/services/reservasService.ts
import { supabase } from "../lib/supabase";

export type Salon = {
  id: string;
  nombre: string;
  capacidad: string;
  icono: string;
};

export type ReservaPayload = {
  salonId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  observaciones: string;
};

export type ReservaResponse = {
  id: string;
  estado: "confirmada" | "pendiente";
};

export const SALONES: Salon[] = [
  { id: "salon-principal", nombre: "Salón principal",   capacidad: "Hasta 40 personas", icono: "business-outline"  },
  { id: "salon-eventos",   nombre: "Salón de eventos",  capacidad: "Hasta 80 personas", icono: "sparkles-outline"  },
  { id: "sala-reuniones",  nombre: "Sala de reuniones", capacidad: "Hasta 12 personas", icono: "briefcase-outline" },
  { id: "terraza",         nombre: "Terraza",            capacidad: "Hasta 30 personas", icono: "leaf-outline"      },
  { id: "sum-infantil",    nombre: "SUM infantil",       capacidad: "Hasta 20 personas", icono: "happy-outline"     },
  { id: "gimnasio",        nombre: "Gimnasio",           capacidad: "Hasta 15 personas", icono: "barbell-outline"   },
];

export async function crearReserva(payload: ReservaPayload): Promise<ReservaResponse> {

  // 1. Usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Usuario no autenticado.");

  // 2. Obtener home_id desde la tabla homes
  const { data: home, error: homeError } = await supabase
    .from("homes")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (homeError || !home?.id) {
    throw new Error("No se encontró el hogar asociado a tu cuenta.");
  }


  // 3. Insertar reserva
  const { data, error: insertError } = await supabase
    .from("reservations")
    .insert({
      home_id:    null,
      user_id:    user.id,
      space:      payload.salonId,
      date:       payload.fecha,
      start_time: payload.horaInicio,
      end_time:   payload.horaFin,
      status:     "pending",
      notes:      payload.observaciones || null,
    })
    .select("id, status")
    .single();

  if (insertError) throw new Error(insertError.message);

  return {
    id:     data.id,
    estado: data.status === "pending" ? "pendiente" : "confirmada",
  };
}