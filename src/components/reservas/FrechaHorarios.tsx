// src/components/reservas/FechaHorario.tsx
 
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from "react-native";
 
// DateTimePicker solo en nativo
let DateTimePicker: any = null;
if (Platform.OS !== "web") {
  DateTimePicker = require("@react-native-community/datetimepicker").default;
}
 
type Props = {
  fecha: string;
  horaInicio: string;
  horaFin: string;
  onFechaChange: (v: string) => void;
  onHoraInicioChange: (v: string) => void;
  onHoraFinChange: (v: string) => void;
};
 
type ModoActivo = "fecha" | "horaInicio" | "horaFin" | null;
 
// ─── Helpers ─────────────────────────────────────────────────────────────────
 
function strToDate(str: string): Date {
  if (!str) return new Date();
  const [h, m] = str.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}
 
function dateToTimeStr(d: Date): string {
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
 
function fechaISOToDisplay(iso: string): string {
  if (!iso) return "Seleccionar";
  const [y, m, d] = iso.split("-");
  const meses = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  return `${parseInt(d)} ${meses[parseInt(m) - 1]} ${y}`;
}
 
// ─── Web: inputs HTML nativos ─────────────────────────────────────────────────
 
function CampoWeb({
  etiqueta,
  icono,
  type,
  value,
  onChange,
}: {
  etiqueta: string;
  icono: string;
  type: "date" | "time";
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{icono} {etiqueta}</Text>
      {/* @ts-ignore — input HTML solo en web */}
      <input
        type={type}
        value={value}
        min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
        onChange={(e: any) => onChange(e.target.value)}
        style={{
          backgroundColor: "#f7f7f7",
          border: "0.5px solid #e0e0e0",
          borderRadius: 8,
          padding: "10px",
          fontSize: 13,
          color: value ? "#1a1a1a" : "#bbb",
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "inherit",
          outline: "none",
          cursor: "pointer",
        }}
      />
    </View>
  );
}
 
// ─── Componente principal ─────────────────────────────────────────────────────
 
export function FechaHorario({
  fecha,
  horaInicio,
  horaFin,
  onFechaChange,
  onHoraInicioChange,
  onHoraFinChange,
}: Props) {
 
  // ── Web: render directo con inputs HTML ──────────────────────────────────
  if (Platform.OS === "web") {
    return (
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>Fecha y horario</Text>
 
        <View style={styles.fila}>
          <CampoWeb
            etiqueta="Fecha"
            icono="📅"
            type="date"
            value={fecha}
            onChange={onFechaChange}
          />
          <CampoWeb
            etiqueta="Hora inicio"
            icono="🕙"
            type="time"
            value={horaInicio}
            onChange={onHoraInicioChange}
          />
        </View>
 
        <View style={[styles.fila, { marginTop: 8 }]}>
          <CampoWeb
            etiqueta="Hora fin"
            icono="🕛"
            type="time"
            value={horaFin}
            onChange={onHoraFinChange}
          />
          <View style={{ flex: 1 }} />
        </View>
      </View>
    );
  }
 
  // ── Nativo iOS / Android ─────────────────────────────────────────────────
  return <FechaHorarioNativo
    fecha={fecha}
    horaInicio={horaInicio}
    horaFin={horaFin}
    onFechaChange={onFechaChange}
    onHoraInicioChange={onHoraInicioChange}
    onHoraFinChange={onHoraFinChange}
  />;
}
 
// ─── Nativo: DateTimePicker para iOS y Android ────────────────────────────────
 
function FechaHorarioNativo({
  fecha, horaInicio, horaFin,
  onFechaChange, onHoraInicioChange, onHoraFinChange,
}: Props) {
  const [modoActivo, setModoActivo] = useState<ModoActivo>(null);
  const [tempDate, setTempDate]     = useState<Date>(new Date());
 
  function abrirPicker(modo: ModoActivo) {
    if (modo === "fecha")      setTempDate(fecha ? new Date(fecha) : new Date());
    if (modo === "horaInicio") setTempDate(strToDate(horaInicio));
    if (modo === "horaFin")    setTempDate(strToDate(horaFin));
    setModoActivo(modo);
  }
 
  function handleChange(_: any, date?: Date) {
    if (!date) return;
    setTempDate(date);
    if (Platform.OS === "android") {
      aplicarValor(date);
      setModoActivo(null);
    }
  }
 
  function aplicarValor(date: Date) {
    if (modoActivo === "fecha") {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      onFechaChange(`${y}-${m}-${d}`);
    } else if (modoActivo === "horaInicio") {
      onHoraInicioChange(dateToTimeStr(date));
    } else if (modoActivo === "horaFin") {
      onHoraFinChange(dateToTimeStr(date));
    }
  }
 
  function confirmarIOS() {
    aplicarValor(tempDate);
    setModoActivo(null);
  }
 
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>Fecha y horario</Text>
 
      <View style={styles.fila}>
        <Campo etiqueta="Fecha"      icono="📅" valor={fechaISOToDisplay(fecha)}  onPress={() => abrirPicker("fecha")} />
        <Campo etiqueta="Hora inicio" icono="🕙" valor={horaInicio || "—"}         onPress={() => abrirPicker("horaInicio")} />
      </View>
      <View style={[styles.fila, { marginTop: 8 }]}>
        <Campo etiqueta="Hora fin"   icono="🕛" valor={horaFin || "—"}            onPress={() => abrirPicker("horaFin")} />
        <View style={{ flex: 1 }} />
      </View>
 
      {Platform.OS === "ios" && modoActivo !== null && (
        <Modal transparent animationType="slide" visible>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>
                  {modoActivo === "fecha" ? "Seleccioná la fecha"
                    : modoActivo === "horaInicio" ? "Hora de inicio" : "Hora de fin"}
                </Text>
                <TouchableOpacity onPress={confirmarIOS} style={styles.btnListo}>
                  <Text style={styles.btnListoTexto}>Listo</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode={modoActivo === "fecha" ? "date" : "time"}
                display="spinner"
                is24Hour
                onChange={handleChange}
                minimumDate={modoActivo === "fecha" ? new Date() : undefined}
                locale="es-AR"
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}
 
      {Platform.OS === "android" && modoActivo !== null && (
        <DateTimePicker
          value={tempDate}
          mode={modoActivo === "fecha" ? "date" : "time"}
          display="default"
          is24Hour
          onChange={handleChange}
          minimumDate={modoActivo === "fecha" ? new Date() : undefined}
        />
      )}
    </View>
  );
}
 
// ─── Campo (nativo) ───────────────────────────────────────────────────────────
 
type CampoProps = {
  etiqueta: string;
  icono: string;
  valor: string;
  onPress: () => void;
};
 
function Campo({ etiqueta, icono, valor, onPress }: CampoProps) {
  return (
    <TouchableOpacity style={styles.campo} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.campoLabel}>{icono} {etiqueta}</Text>
      <View style={styles.campoInput}>
        <Text style={[styles.campoValor, valor === "Seleccionar" && styles.placeholder]}>
          {valor}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
 
// ─── Estilos ──────────────────────────────────────────────────────────────────
 
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    padding: 14,
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  fila: {
    flexDirection: "row",
    gap: 8,
  },
  campo: {
    flex: 1,
  },
  campoLabel: {
    fontSize: 10,
    color: "#999",
    fontWeight: "500",
    marginBottom: 5,
  },
  campoInput: {
    backgroundColor: "#f7f7f7",
    borderWidth: 0.5,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  campoValor: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  placeholder: {
    color: "#bbb",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e0e0e0",
  },
  modalTitulo: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  btnListo: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#185FA5",
    borderRadius: 8,
  },
  btnListoTexto: {
    fontSize: 13,
    fontWeight: "500",
    color: "#fff",
  },
  picker: {
    backgroundColor: "#fff",
  },
});