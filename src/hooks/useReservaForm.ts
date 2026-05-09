// src/hooks/useReservaForm.ts

import { useState, useMemo } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { crearReserva, SALONES, type Salon } from "../services/reservasService";

type FormState = {
  salonId: string;
  fecha: string;       // "YYYY-MM-DD"
  horaInicio: string;  // "HH:MM"
  horaFin: string;     // "HH:MM"
  observaciones: string;
};

const FORM_INICIAL: FormState = {
  salonId: SALONES[0].id,
  fecha: "",
  horaInicio: "",
  horaFin: "",
  observaciones: "",
};

export function useReservaForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(FORM_INICIAL);
  const [loading, setLoading] = useState(false);

  const salonSeleccionado: Salon =
    SALONES.find((s) => s.id === form.salonId) ?? SALONES[0];

  // ✅ Recibe key y value directamente — sin evento web
  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const errorValidacion = useMemo<string | null>(() => {
    if (!form.fecha)      return "Seleccioná una fecha.";
    if (!form.horaInicio) return "Indicá la hora de inicio.";
    if (!form.horaFin)    return "Indicá la hora de fin.";
    if (form.horaInicio >= form.horaFin)
      return "La hora de fin debe ser posterior a la de inicio.";
    return null;
  }, [form]);

  const formularioCompleto = errorValidacion === null;

  async function confirmar() {
    if (errorValidacion) {
      Alert.alert("Datos incompletos", errorValidacion);
      return;
    }

    setLoading(true);
    try {
      await crearReserva({
        salonId:       form.salonId,
        fecha:         form.fecha,
        horaInicio:    form.horaInicio,
        horaFin:       form.horaFin,
        observaciones: form.observaciones.trim(),
      });

      Alert.alert(
        "¡Reserva confirmada!",
        `Tu reserva en ${salonSeleccionado.nombre} fue registrada.`,
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "No se pudo registrar la reserva.");
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    setField,
    salonSeleccionado,
    formularioCompleto,
    loading,
    confirmar,
  };
}