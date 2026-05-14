// src/features/reservas/ReservasScreen.tsx

import React from "react";
import {
  ScrollView, View, Text, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useReservaForm } from "../../hooks/useReservaForm";
import { SalonSelector } from "../../components/reservas/SalonSelector";
import { FechaHorario } from "../../components/reservas/FrechaHorarios";
import { Observaciones } from "../../components/reservas/Observaciones";
import { ResumenConfirmacion } from "../../components/reservas/ResumenConfirmacion";

export function ReservasScreen() {
  const router = useRouter();
  const { form, setField, salonSeleccionado, formularioCompleto, loading, confirmar } = useReservaForm();

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Nueva reserva</Text>
          <Text style={styles.subtitulo}>Torre A · Piso 3 · Depto 3B</Text>
        </View>
        <TouchableOpacity
          style={styles.btnMisReservas}
          onPress={() => router.push("/reservas/mis-reservas")}
          activeOpacity={0.8}
        >
          <Ionicons name="list-outline" size={15} color="#185FA5" />
          <Text style={styles.btnMisReservasTexto}>Mis reservas</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido scrolleable */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <SalonSelector
          salonActivo={form.salonId}
          onSeleccionar={(id) => setField("salonId", id)}
        />

        <FechaHorario
          fecha={form.fecha}
          horaInicio={form.horaInicio}
          horaFin={form.horaFin}
          onFechaChange={(v) => setField("fecha", v)}
          onHoraInicioChange={(v) => setField("horaInicio", v)}
          onHoraFinChange={(v) => setField("horaFin", v)}
        />

        <Observaciones
          valor={form.observaciones}
          onChange={(v) => setField("observaciones", v)}
        />

        <ResumenConfirmacion
          salon={salonSeleccionado}
          fecha={form.fecha}
          horaInicio={form.horaInicio}
          horaFin={form.horaFin}
          observaciones={form.observaciones}
        />

        {/* Botón confirmar */}
        <TouchableOpacity
          style={[styles.btnConfirmar, (!formularioCompleto || loading) && styles.btnDisabled]}
          onPress={confirmar}
          disabled={!formularioCompleto || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="calendar-outline" size={18} color="#fff" />
              <Text style={styles.btnTexto}>Confirmar reserva</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f2f3f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e5e5",
  },
  btnBack: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#f2f3f5",
    alignItems: "center",
    justifyContent: "center",
  },
  titulo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  subtitulo: {
    fontSize: 11,
    color: "#888",
    marginTop: 1,
  },
  scroll: {
    padding: 12,
    paddingBottom: 32,
  },
  btnConfirmar: {
    backgroundColor: "#185FA5",
    borderRadius: 12,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnTexto: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  btnMisReservas: {
  flexDirection: "row",
  alignItems: "center",
  gap: 5,
  backgroundColor: "#E6F1FB",
  paddingHorizontal: 10,
  paddingVertical: 7,
  borderRadius: 8,
},
btnMisReservasTexto: {
  fontSize: 12,
  fontWeight: "500",
  color: "#185FA5",
},
});