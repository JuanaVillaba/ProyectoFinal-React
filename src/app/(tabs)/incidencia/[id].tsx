// app/(tabs)/incidencia/[id].tsx
import React, { useMemo, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Pressable,
  Animated, ScrollView, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import EstadoBadge from '@/components/incidencia/EstadoBadge';
import {
  useIncidenciaStore,
  EstadoIncidencia,
  COLORS,
  ESTADO_META,
  PRIORIDAD_META,
} from '@/features/incidencias/incidencia.store';

// ─── Timeline ─────────────────────────────────────────────────────────────────
const STEPS: { key: EstadoIncidencia; label: string; sub: string }[] = [
  { key: 'pendiente',  label: 'Reportado',  sub: 'Incidente registrado en el sistema' },
  { key: 'en_proceso', label: 'En proceso', sub: 'Equipo asignado, trabajando en ello' },
  { key: 'resuelto',   label: 'Resuelto',   sub: 'Incidente cerrado exitosamente' },
];

function Timeline({ estado }: { estado: EstadoIncidencia }) {
  const currentIdx = STEPS.findIndex((s) => s.key === estado);

  return (
    <View style={tl.wrap}>
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent   = i === currentIdx;
        const isActive    = i <= currentIdx;
        const meta        = ESTADO_META[step.key];

        return (
          <View key={step.key} style={tl.row}>
            {/* Columna de línea + punto */}
            <View style={tl.lineCol}>
              {i > 0 && (
                <View style={[tl.lineUp, { backgroundColor: isActive ? meta.color : COLORS.border }]} />
              )}
              <View
                style={[
                  tl.dot,
                  {
                    backgroundColor: isActive ? meta.color : COLORS.surface,
                    borderColor:     isActive ? meta.color : COLORS.border,
                    borderWidth:     isCurrent ? 3 : 1.5,
                    transform:       [{ scale: isCurrent ? 1.2 : 1 }],
                  },
                ]}
              >
                {isCompleted && <Ionicons name="checkmark" size={9} color="#fff" />}
                {isCurrent && <View style={[tl.dotCore, { backgroundColor: '#fff' }]} />}
              </View>
              {i < STEPS.length - 1 && (
                <View
                  style={[
                    tl.lineDown,
                    { backgroundColor: i < currentIdx ? ESTADO_META[STEPS[i + 1].key].color : COLORS.border },
                  ]}
                />
              )}
            </View>

            {/* Contenido */}
            <View style={tl.content}>
              <View style={tl.labelRow}>
                <Text style={[tl.label, { color: isActive ? COLORS.textPrimary : COLORS.textMuted }]}>
                  {step.label}
                </Text>
                {isCurrent && (
                  <View style={[tl.pill, { backgroundColor: meta.color + '25' }]}>
                    <Text style={[tl.pillText, { color: meta.color }]}>Actual</Text>
                  </View>
                )}
              </View>
              <Text style={[tl.sub, { color: isActive ? COLORS.textSecondary : COLORS.textMuted }]}>
                {step.sub}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const tl = StyleSheet.create({
  wrap:    { gap: 0 },
  row:     { flexDirection: 'row', gap: 14 },
  lineCol: { width: 22, alignItems: 'center' },
  lineUp:  { width: 2, height: 10, borderRadius: 1 },
  lineDown: { width: 2, flex: 1, minHeight: 20, borderRadius: 1 },
  dot: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', zIndex: 1,
  },
  dotCore: { width: 7, height: 7, borderRadius: 4 },
  content: { flex: 1, paddingBottom: 20, gap: 2 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label:    { fontSize: 15, fontWeight: '700' },
  sub:      { fontSize: 13, lineHeight: 18 },
  pill:     { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 },
  pillText: { fontSize: 11, fontWeight: '700' },
});

// ─── InfoCard ─────────────────────────────────────────────────────────────────
function InfoCard({ icon, label, value, color = COLORS.accent }: {
  icon: string; label: string; value: string; color?: string;
}) {
  return (
    <View style={ic.card}>
      <View style={[ic.iconWrap, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ic.label}>{label}</Text>
        <Text style={ic.value} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}
const ic = StyleSheet.create({
  card: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.surface, borderRadius: 14,
    padding: 14, gap: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  label:    { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase' },
  value:    { fontSize: 14, color: COLORS.textPrimary, fontWeight: '600', marginTop: 1 },
});

// ─── SectionCard ─────────────────────────────────────────────────────────────
function SectionCard({ title, icon, children }: {
  title: string; icon?: string; children: React.ReactNode;
}) {
  return (
    <View style={sc.card}>
      <View style={sc.header}>
        {icon && <Ionicons name={icon as any} size={14} color={COLORS.textSecondary} />}
        <Text style={sc.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}
const sc = StyleSheet.create({
  card:   { backgroundColor: COLORS.surface, borderRadius: 16, padding: 18, gap: 14, borderWidth: 1, borderColor: COLORS.border },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title:  { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: COLORS.textSecondary },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function IncidenciaDetalle() {
  const params       = useLocalSearchParams<{ id: string }>();
  const router       = useRouter();
  const scrollY      = useRef(new Animated.Value(0)).current;
  const fadeIn       = useRef(new Animated.Value(0)).current;

  const incidencia   = useIncidenciaStore((s) => s.incidencias.find((i) => i.id === params.id));
  const updateEstado = useIncidenciaStore((s) => s.updateEstado);
  const deleteInc    = useIncidenciaStore((s) => s.deleteIncidencia);

  useEffect(() => {
    Animated.timing(fadeIn, { toValue: 1, duration: 380, useNativeDriver: false }).start();
  }, []);

  if (!incidencia) {
    return (
      <View style={styles.root}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.notFound}>
          <Ionicons name="alert-circle-outline" size={56} color={COLORS.textMuted} />
          <Text style={styles.nfTitle}>Incidente no encontrado</Text>
          <Pressable style={styles.nfBtn} onPress={() => router.back()}>
            <Text style={styles.nfBtnText}>Volver</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const meta     = ESTADO_META[incidencia.estado];
  const priMeta  = PRIORIDAD_META[incidencia.prioridad];

  const heroHeight = scrollY.interpolate({
    inputRange:  [0, 90],
    outputRange: [170, 82],
    extrapolate: 'clamp',
  });

  const handleDelete = () => {
    if (!nextEstado) return;

  Alert.alert(
    'Actualizar estado',
    `¿Confirmás que el incidente pasó a estado "${ESTADO_META[nextEstado].label}"?`,
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Confirmar',
        onPress: async () => {
          await updateEstado(incidencia.id, nextEstado);
          // Opcional: una notificación de éxito
        },
      },
    ]
  );
    Alert.alert(
      'Eliminar incidente',
      '¿Confirmás que querés eliminar este incidente? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => { deleteInc(incidencia.id); router.back(); },
        },
      ]
    );
  };

  const nextEstado: EstadoIncidencia | null =
    incidencia.estado === 'pendiente'  ? 'en_proceso' :
    incidencia.estado === 'en_proceso' ? 'resuelto'   : null;

  return (
    <View style={styles.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Hero animado ── */}
      <Animated.View style={[styles.hero, { height: heroHeight }]}>
        {/* Back */}
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
        </Pressable>

        {/* Menú / eliminar */}
        <Pressable style={styles.menuBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
        </Pressable>

        <Animated.View style={{ opacity: fadeIn, gap: 6 }}>
          <EstadoBadge estado={incidencia.estado} />
          <Text style={styles.heroTitle} numberOfLines={2}>
            {incidencia.titulo}
          </Text>
        </Animated.View>
      </Animated.View>

      {/* ── Contenido ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Info grid */}
        <View style={styles.infoRow}>
          <InfoCard icon="layers-outline"   label="Servicio"   value={incidencia.servicio}       color={COLORS.accent} />
          <InfoCard icon="flame-outline"    label="Prioridad"  value={priMeta.label}             color={priMeta.color} />
        </View>
        <View style={styles.infoRow}>
          <InfoCard icon="calendar-outline" label="Reportado"  value={formatFecha(incidencia.fecha)} color="#a78bfa" />
          {incidencia.fechaActualizacion && (
            <InfoCard icon="refresh-outline" label="Actualizado" value={formatFecha(incidencia.fechaActualizacion)} color={COLORS.resuelto} />
          )}
        </View>

        {/* Descripción */}
        <SectionCard title="Descripción" icon="document-text-outline">
          <Text style={styles.descText}>{incidencia.descripcion}</Text>
        </SectionCard>

        {/* Timeline */}
        <SectionCard title="Estado del incidente" icon="git-branch-outline">
          <Timeline estado={incidencia.estado} />
        </SectionCard>

        {/* Acción: avanzar estado */}
        {nextEstado && (
          <Pressable
            style={[styles.advanceBtn, { borderColor: ESTADO_META[nextEstado].color + '60' }]}
            onPress={() => updateEstado(incidencia.id, nextEstado)}
          >
            <Ionicons
              name={ESTADO_META[nextEstado].icon as any}
              size={18}
              color={ESTADO_META[nextEstado].color}
            />
            <Text style={[styles.advanceBtnText, { color: ESTADO_META[nextEstado].color }]}>
              Marcar como "{ESTADO_META[nextEstado].label}"
            </Text>
          </Pressable>
        )}

        {/* ID técnico */}
        <View style={styles.idRow}>
          <Ionicons name="finger-print-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.idText}>ID: {incidencia.id}</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ─── Utilidad ─────────────────────────────────────────────────────────────────
function formatFecha(iso: string) {
  return new Date(iso).toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  hero: {
    backgroundColor:  COLORS.surface,
    paddingHorizontal: 20,
    paddingTop:        52,
    paddingBottom:     18,
    justifyContent:    'flex-end',
    gap:               8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    position:       'absolute',
    top:            50,
    left:           16,
    width:          36,
    height:         36,
    borderRadius:   10,
    backgroundColor: COLORS.surfaceHigh,
    alignItems:     'center',
    justifyContent: 'center',
  },
  menuBtn: {
    position:       'absolute',
    top:            50,
    right:          16,
    width:          36,
    height:         36,
    borderRadius:   10,
    backgroundColor: COLORS.danger + '18',
    alignItems:     'center',
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize:      22,
    fontWeight:    '800',
    color:         COLORS.textPrimary,
    letterSpacing: -0.3,
    lineHeight:    28,
  },

  scrollContent: {
    padding:       16,
    gap:           12,
    paddingBottom: 50,
  },
  infoRow: { flexDirection: 'row', gap: 10 },

  descText: {
    fontSize:   15,
    color:      COLORS.textSecondary,
    lineHeight: 22,
  },

  advanceBtn: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
    padding:        14,
    borderRadius:   14,
    borderWidth:    1.5,
    backgroundColor: COLORS.surface,
  },
  advanceBtnText: { fontSize: 15, fontWeight: '700' },

  idRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center', paddingTop: 6 },
  idText: { fontSize: 11, color: COLORS.textMuted, fontFamily: 'monospace' },

  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  nfTitle:  { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  nfBtn:    { marginTop: 8, backgroundColor: COLORS.accent, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 10 },
  nfBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
