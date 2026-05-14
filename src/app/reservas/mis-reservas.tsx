// src/app/(tabs)/reservas/mis-reservas.tsx

import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  ActivityIndicator, StyleSheet, SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

type Reserva = {
  id: string;
  space: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
};

const NOMBRES: Record<string, string> = {
  "salon-principal": "Salón principal",
  "salon-eventos":   "Salón de eventos",
  "sala-reuniones":  "Sala de reuniones",
  "terraza":         "Terraza",
  "sum-infantil":    "SUM infantil",
  "gimnasio":        "Gimnasio",
};

function formatFecha(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} ${y}`;
}

export default function MisReservasScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    cargarReservas();
  }, []);

  async function cargarReservas() {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { data, error: fetchError } = await supabase
        .from("reservations")
        .select("id, space, date, start_time, end_time, status, notes")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (fetchError) throw fetchError;
      setReservas(data ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.btnBack}>
          <Ionicons name="arrow-back" size={20} color="#1a1a1a" />
        </TouchableOpacity>
        <View>
          <Text style={styles.titulo}>Mis reservas</Text>
          <Text style={styles.subtitulo}>{reservas.length} reserva{reservas.length !== 1 ? "s" : ""}</Text>
        </View>
      </View>

      {/* Contenido */}
      {loading ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color="#185FA5" />
        </View>
      ) : error ? (
        <View style={styles.centro}>
          <Text style={styles.errorTexto}>{error}</Text>
          <TouchableOpacity onPress={cargarReservas} style={styles.btnReintentar}>
            <Text style={styles.btnReintentarTexto}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : reservas.length === 0 ? (
        <View style={styles.centro}>
          <Ionicons name="calendar-outline" size={48} color="#ccc" />
          <Text style={styles.vacioTexto}>No tenés reservas aún</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {reservas.map((r) => (
            <View key={r.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardSalon}>{NOMBRES[r.space] ?? r.space}</Text>
                <View style={[styles.badge, r.status === "pending" && styles.badgePending]}>
                  <Text style={styles.badgeTexto}>
                    {r.status === "pending" ? "Pendiente" : "Confirmada"}
                  </Text>
                </View>
              </View>
              <View style={styles.cardFila}>
                <Ionicons name="calendar-outline" size={13} color="#888" />
                <Text style={styles.cardTexto}>{formatFecha(r.date)}</Text>
              </View>
              <View style={styles.cardFila}>
                <Ionicons name="time-outline" size={13} color="#888" />
                <Text style={styles.cardTexto}>{r.start_time} – {r.end_time} hs</Text>
              </View>
              {r.notes && (
                <View style={styles.cardFila}>
                  <Ionicons name="chatbubble-outline" size={13} color="#888" />
                  <Text style={styles.cardTexto}>{r.notes}</Text>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: "#f2f3f5" },
  header:       { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: "#e5e5e5" },
  btnBack:      { width: 34, height: 34, borderRadius: 8, backgroundColor: "#f2f3f5", alignItems: "center", justifyContent: "center" },
  titulo:       { fontSize: 15, fontWeight: "500", color: "#1a1a1a" },
  subtitulo:    { fontSize: 11, color: "#888", marginTop: 1 },
  scroll:       { padding: 12, paddingBottom: 32 },
  centro:       { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  errorTexto:   { fontSize: 13, color: "#e53935" },
  vacioTexto:   { fontSize: 13, color: "#aaa", marginTop: 8 },
  btnReintentar:      { backgroundColor: "#185FA5", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8 },
  btnReintentarTexto: { color: "#fff", fontSize: 13, fontWeight: "500" },
  card:         { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#e0e0e0", padding: 14, marginBottom: 8, gap: 6 },
  cardHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  cardSalon:    { fontSize: 14, fontWeight: "500", color: "#1a1a1a" },
  badge:        { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, backgroundColor: "#E6F1FB" },
  badgePending: { backgroundColor: "#FFF3E0" },
  badgeTexto:   { fontSize: 10, fontWeight: "500", color: "#185FA5" },
  cardFila:     { flexDirection: "row", alignItems: "center", gap: 6 },
  cardTexto:    { fontSize: 12, color: "#555" },
});