// src/services/reservasService.ts

export type Salon = {
    id: string;
    nombre: string;
    capacidad: string;
    icono: string;
    };

    export type ReservaPayload = {
    salonId: string;
    fecha: string;       // ISO "YYYY-MM-DD"
    horaInicio: string;  // "HH:MM"
    horaFin: string;     // "HH:MM"
    observaciones: string;
    };

    export type ReservaResponse = {
    id: string;
    estado: "confirmada" | "pendiente";
    };

    // ─── Datos estáticos ────────────────────────────────────────────────────────

    export const SALONES: Salon[] = [
    { id: "salon-principal", nombre: "Salón principal",  capacidad: "Hasta 40 personas", icono: "business-outline" },
    { id: "salon-eventos",   nombre: "Salón de eventos", capacidad: "Hasta 80 personas", icono: "sparkles-outline" },
    { id: "sala-reuniones",  nombre: "Sala de reuniones",capacidad: "Hasta 12 personas", icono: "briefcase-outline" },
    { id: "terraza",         nombre: "Terraza",           capacidad: "Hasta 30 personas", icono: "leaf-outline" },
    { id: "sum-infantil",    nombre: "SUM infantil",      capacidad: "Hasta 20 personas", icono: "happy-outline" },
    { id: "gimnasio",        nombre: "Gimnasio",          capacidad: "Hasta 15 personas", icono: "barbell-outline" },
    ];

    // ─── API ─────────────────────────────────────────────────────────────────────

    const BASE_URL = "https://api.tuapp.com"; // reemplazá con tu endpoint real

    export async function crearReserva(payload: ReservaPayload): Promise<ReservaResponse> {
    const res = await fetch(`${BASE_URL}/reservas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message ?? `Error ${res.status}`);
    }

    return res.json();
    }