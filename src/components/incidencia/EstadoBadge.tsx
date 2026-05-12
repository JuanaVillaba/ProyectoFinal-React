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
  estado,
  variant = 'pill',
  size    = 'md',
}: Props) {
  const meta    = ESTADO_META[estado] || ESTADO_META['pendiente'];
  const isSolid = variant === 'solid';
  const isSm    = size === 'sm';

  const bgColor  = isSolid ? meta?.color : meta?.color + '20';
  const txtColor = isSolid ? '#fff'     : meta?.color;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:   bgColor,
          borderColor:       isSolid ? 'transparent' : meta?.color + '50',
          paddingHorizontal: isSm ? 7  : 10,
          paddingVertical:   isSm ? 3  : 5,
        },
      ]}
    >
      <Ionicons name={meta.icon as any} size={isSm ? 10 : 12} color={txtColor} />
      <Text style={[styles.label, { color: txtColor, fontSize: isSm ? 10 : 12 }]}>
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
});
