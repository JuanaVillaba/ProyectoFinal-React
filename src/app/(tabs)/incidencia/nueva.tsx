import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import IncidenciaForm from '@/components/incidencia/IncidenciaForm';
import {
  useIncidenciaStore,
  NuevaIncidencia,
  COLORS,
} from '@/features/incidencias/incidencia.store';

export default function NuevaIncidenciaScreen() {
  const router        = useRouter();
  const addIncidencia = useIncidenciaStore((s) => s.addIncidencia);
  const loading       = useIncidenciaStore((s) => s.loading);

  const handleSubmit = (data: NuevaIncidencia) => {
    addIncidencia(data);
    // TODO: cuando integres Supabase reemplazá por: await syncAddIncidencia(data)
    router.back();
  };

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header manual ── */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
        </Pressable>
        <View>
          <Text style={styles.eyebrow}>Nuevo reporte</Text>
          <Text style={styles.title}>Reportar incidente</Text>
        </View>
      </View>

      {/* ── Formulario ── */}
      <IncidenciaForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             14,
    paddingHorizontal: 16,
    paddingTop:      54,
    paddingBottom:   16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor:  COLORS.surface,
  },
  backBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    backgroundColor: COLORS.surfaceHigh,
    alignItems:     'center',
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize:      10,
    fontWeight:    '700',
    letterSpacing:  1.4,
    color:         COLORS.accent,
    textTransform: 'uppercase',
  },
  title: {
    fontSize:   18,
    fontWeight: '800',
    color:      COLORS.textPrimary,
    letterSpacing: -0.3,
  },
});
