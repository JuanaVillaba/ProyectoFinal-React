// src/components/reservas/Observaciones.tsx

import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

type Props = {
  valor: string;
  onChange: (v: string) => void;
};

export function Observaciones({ valor, onChange }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>Observaciones</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={onChange}
        placeholder="Indicá equipamiento, acceso especial u otro detalle..."
        placeholderTextColor="#bbb"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    padding: 14,
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#f7f7f7",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: "#1a1a1a",
    minHeight: 72,
  },
});