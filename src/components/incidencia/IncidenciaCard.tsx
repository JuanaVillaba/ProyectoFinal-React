import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import EstadoBadge from './EstadoBadge';
import {
  Incidencia,
  COLORS,
  ESTADO_META,
  PRIORIDAD_META,
} from '@/features/incidencias/incidencia.store';
import { supabase } from '@/supabase/supabase';
type Props = {
  id: string;
  title: string;        // antes era titulo
  description: string;  // antes era descripcion
  status: string;       // antes era estado
  created_at: string;   // antes era fecha
  type: string;         // lo usaremos para 'servicio'
  // prioridad: string; // Nota: No veo 'prioridad' en tu imagen de tabla, 
                        // si no existe, la quitamos o le damos un default.
};

function fechaRelativa(isoStr: string): string {
  const diff  = Date.now() - new Date(isoStr).getTime();
  const min   = Math.floor(diff / 60_000);
  const hrs   = Math.floor(min  / 60);
  const days  = Math.floor(hrs  / 24);
  if (min  < 1)  return 'Ahora mismo';
  if (min  < 60) return `Hace ${min} min`;
  if (hrs  < 24) return `Hace ${hrs} h`;
  if (days < 7)  return `Hace ${days} días`;
  return new Date(isoStr).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' });
}

export default function IncidenciaCard({
  id, title, description, status, type, created_at,
}: Props) {
  const router    = useRouter();
  const scale     = useRef(new Animated.Value(1)).current

  const estadoClave = (status?.toLowerCase() || 'pendiente') as keyof typeof ESTADO_META;
  const estadoMeta = ESTADO_META[estadoClave] || ESTADO_META.pendiente;

  //const prioridadClave = (priority?.toLowerCase() || 'baja') as keyof typeof PRIORIDAD_META;
  //const priMeta = PRIORIDAD_META[prioridadClave] || PRIORIDAD_META.baja;
  const onPressIn  = () =>
    Animated.spring(scale, { toValue: 0.972, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();

  return (
    <Pressable
      onPress={() => router.push(`/incidencia/${id}`)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Barra lateral coloreada por estado */}
        <View style={[styles.accentBar, { backgroundColor: estadoMeta.color }]} />

        <View style={styles.body}>
          {/* Fila superior */}
          <View style={styles.topRow}>
            <Text style={styles.titulo} numberOfLines={1}>{title}</Text>
            <EstadoBadge estado={estadoClave} size="sm" />
          </View>

          {/* Descripción */}
          <Text style={styles.descripcion} numberOfLines={2}>{description}</Text>

          {/* Footer */}
          <View style={styles.footer}>
            {/* Servicio */}
            <View style={styles.chip}>
              <Ionicons name="layers-outline" size={11} color={COLORS.textMuted} />
              <Text style={styles.chipText}>{type}</Text>
            </View>

            {/* Prioridad */}
            

            <View style={{ flex: 1 }} />

            {/* Fecha relativa */}
            <Ionicons name="time-outline" size={11} color={COLORS.textMuted} />
            <Text style={styles.fecha}>{fechaRelativa(created_at)}</Text>
            <Ionicons name="chevron-forward" size={14} color={COLORS.textMuted} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection:   'row',
    backgroundColor: COLORS.surface,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     COLORS.border,
    overflow:        'hidden',
  },
  accentBar: {
    width: 4,
  },
  body: {
    flex:    1,
    padding: 14,
    gap:     8,
  },
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            8,
  },
  titulo: {
    flex:          1,
    fontSize:      15,
    fontWeight:    '700',
    color:         COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  descripcion: {
    fontSize:   13,
    color:      COLORS.textSecondary,
    lineHeight: 19,
  },
  footer: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginTop:     2,
  },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   COLORS.surfaceHigh,
    borderRadius:      20,
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderWidth:       1,
    borderColor:       COLORS.border,
  },
  chipText: {
    fontSize:   11,
    color:      COLORS.textMuted,
    fontWeight: '600',
  },
  fecha: {
    fontSize: 11,
    color:    COLORS.textMuted,
  },
});
//<View style={[styles.chip, { borderColor: priMeta.color + '44' }]}>
            //  <Ionicons name={priMeta.icon as any} size={11} color={priMeta.color} />
            //  <Text style={[styles.chipText, { color: priMeta.color }]}>
            //    {priMeta.label}
            //  </Text>
            //</View>