import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EstadoIncidencia, ESTADO_META } from '@/features/incidencias/incidencia.store';

type Props = {
  estado: EstadoIncidencia;
  /** 'pill' (default) → fondo suave + borde | 'solid' → fondo lleno */
  variant?: 'pill' | 'solid';
  /** 'md' (default) | 'sm' */
  size?: 'sm' | 'md';
};

export default function EstadoBadge({
  estado, size = 'md' }: { estado: string, size?: 'sm' | 'md' }) {
  
  // 🛡️ PROTECCIÓN TOTAL: 
  // Si 'estado' no existe en tus constantes, usamos 'pendiente' como plan B.
  // Esto evita que la app intente leer .color de algo que no existe.
  const meta = ESTADO_META[estado as keyof typeof ESTADO_META] || ESTADO_META.pendiente;

  return (
    <View style={[
      styles.badge, 
      { backgroundColor: meta.color + '22', borderColor: meta.color }, 
      size === 'sm' && styles.badgeSm
    ]}>
      <Text style={[styles.text, { color: meta.color }, size === 'sm' && styles.textSm]}>
        {meta.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems:    'center',
    alignSelf:     'flex-start',
    borderRadius:  20,
    borderWidth:   1,
    gap:           4,
  },
  label: {
    fontWeight:    '700',
    letterSpacing:  0.2,
  },
   badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  textSm: {
    fontSize: 10,
  },
});
