// src/components/reservas/ResumenConfirmacion.tsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Salon } from "../../services/reservasService";

type Props = {
  salon: Salon;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  observaciones: string;
};

function formatFecha(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} ${y}`;
}

export function ResumenConfirmacion({ salon, fecha, horaInicio, horaFin, observaciones }: Props) {
  const filas = [
    { clave: "Salón",    valor: salon.nombre },
    { clave: "Fecha",    valor: formatFecha(fecha) },
    { clave: "Horario",  valor: `${horaInicio || "—"} – ${horaFin || "—"} hs` },
    ...(observaciones.trim()
      ? [{ clave: "Observaciones", valor: observaciones }]
      : []),
  ];

  return (
    <View style={styles.caja}>
      <View style={styles.header}>
        <Ionicons name="checkmark-circle-outline" size={18} color="#3B6D11" />
        <Text style={styles.headerTexto}>Resumen de la reserva</Text>
      </View>

      {filas.map((fila, i) => (
        <View
          key={fila.clave}
          style={[styles.fila, i < filas.length - 1 && styles.filaBorde]}
        >
          <Text style={styles.clave}>{fila.clave}</Text>
          <Text style={styles.valor} numberOfLines={2}>{fila.valor}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    backgroundColor: "#EAF3DE",
    borderWidth: 1.5,
    borderColor: "#97C459",
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 10,
  },
  headerTexto: {
    fontSize: 12,
    fontWeight: "500",
    color: "#27500A",
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 5,
  },
  filaBorde: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#C0DD97",
  },
  clave: {
    fontSize: 11,
    color: "#3B6D11",
  },
  valor: {
    fontSize: 11,
    fontWeight: "500",
    color: "#27500A",
    maxWidth: "55%",
    textAlign: "right",
},
});