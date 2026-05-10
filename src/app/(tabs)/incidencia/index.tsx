import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable,
  StyleSheet, Animated, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import IncidenciaCard from '@/components/incidencia/IncidenciaCard';
import {
  useIncidenciaStore,
  EstadoIncidencia,
  COLORS,
  ESTADO_META,
} from '@/features/incidencias/incidencia.store';

// ─── Filtros ──────────────────────────────────────────────────────────────────
type Filtro = 'todos' | EstadoIncidencia;

const FILTROS: { key: Filtro; label: string; color: string }[] = [
  { key: 'todos',      label: 'Todos',      color: COLORS.accent     },
  { key: 'pendiente',  label: 'Pendiente',  color: COLORS.pendiente  },
  { key: 'en_proceso', label: 'En proceso', color: COLORS.en_proceso },
  { key: 'resuelto',   label: 'Resuelto',   color: COLORS.resuelto   },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  const shimmer = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 800, useNativeDriver: true }),
      ])
    ).start();
  }, []);
  const opacity = shimmer.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.7] });
  return (
    <Animated.View style={[sk.card, { opacity }]}>
      <View style={sk.bar} />
      <View style={sk.body}>
        <View style={sk.title} />
        <View style={sk.line} />
        <View style={[sk.line, { width: '55%' }]} />
        <View style={sk.footer} />
      </View>
    </Animated.View>
  );
}
const sk = StyleSheet.create({
  card:   { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  bar:    { width: 4, backgroundColor: COLORS.surfaceHigh },
  body:   { flex: 1, padding: 14, gap: 10 },
  title:  { height: 16, width: '65%', borderRadius: 6, backgroundColor: COLORS.surfaceHigh },
  line:   { height: 12, width: '90%', borderRadius: 6, backgroundColor: COLORS.surfaceHigh },
  footer: { height: 12, width: '40%', borderRadius: 6, backgroundColor: COLORS.surfaceHigh },
});

// ─── Card animada ─────────────────────────────────────────────────────────────
function AnimatedCard({ children, index }: { children: React.ReactNode; index: number }) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity,    { toValue: 1, duration: 320, delay: index * 70, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 320, delay: index * 70, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ busqueda, filtro }: { busqueda: string; filtro: Filtro }) {
  return (
    <View style={emp.wrap}>
      <Ionicons name="file-tray-outline" size={56} color={COLORS.textMuted} />
      <Text style={emp.title}>
        {busqueda ? 'Sin resultados' : 'Sin incidentes'}
      </Text>
      <Text style={emp.sub}>
        {busqueda
          ? `No encontramos coincidencias para "${busqueda}"`
          : filtro !== 'todos'
            ? `No hay incidentes ${ESTADO_META[filtro as EstadoIncidencia]?.label.toLowerCase()}`
            : 'Presioná + para reportar el primero'}
      </Text>
    </View>
  );
}
const emp = StyleSheet.create({
  wrap:  { alignItems: 'center', paddingTop: 64, gap: 10 },
  title: { fontSize: 17, fontWeight: '700', color: COLORS.textPrimary },
  sub:   { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', paddingHorizontal: 24 },
});

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function IncidenciasScreen() {
  const router  = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro]     = useState<Filtro>('todos');
  const fabScale = useRef(new Animated.Value(1)).current;

  // Store
  const incidencias = useIncidenciaStore((s) => s.incidencias);
  const loading     = useIncidenciaStore((s) => s.loading);

  // Filtrado local
  const data = incidencias.filter((i) => {
    const okEstado  = filtro === 'todos' || i.estado === filtro;
    const q         = busqueda.toLowerCase();
    const okBusqueda = !q || i.titulo.toLowerCase().includes(q) || i.servicio.toLowerCase().includes(q);
    return okEstado && okBusqueda;
  });

  // Conteos para los chips
  const count = (k: Filtro) =>
    k === 'todos' ? incidencias.length : incidencias.filter((i) => i.estado === k).length;

  const onFabPress = () => {
    Animated.sequence([
      Animated.timing(fabScale, { toValue: 0.87, duration: 90, useNativeDriver: true }),
      Animated.timing(fabScale, { toValue: 1,    duration: 90, useNativeDriver: true }),
    ]).start(() => router.push('/incidencia/nueva'));
  };

  return (
    <View style={styles.root}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.eyebrow}>Centro de operaciones</Text>
          <Text style={styles.title}>Incidentes</Text>
        </View>
        <View style={styles.totalBadge}>
          <Text style={styles.totalText}>{incidencias.length}</Text>
        </View>
      </View>

      {/* ── Búsqueda ── */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={17} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título o servicio..."
          placeholderTextColor={COLORS.textMuted}
          value={busqueda}
          onChangeText={setBusqueda}
        />
        {busqueda.length > 0 && (
          <Pressable onPress={() => setBusqueda('')}>
            <Ionicons name="close-circle" size={17} color={COLORS.textMuted} />
          </Pressable>
        )}
      </View>

      {/* ── Filtros ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtrosScroll}
        contentContainerStyle={styles.filtrosContent}
      >
        {FILTROS.map((f) => {
          const active = filtro === f.key;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFiltro(f.key)}
              style={[
                styles.chip,
                active && { backgroundColor: f.color, borderColor: f.color },
              ]}
            >
              <Text style={[styles.chipLabel, active && { color: '#fff' }]}>
                {f.label}
              </Text>
              <View style={[styles.chipCount, active && { backgroundColor: 'rgba(255,255,255,0.22)' }]}>
                <Text style={[styles.chipCountText, active && { color: '#fff' }]}>
                  {count(f.key)}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Lista / Skeleton ── */}
      {loading ? (
        <View style={styles.skeletonWrap}>
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState busqueda={busqueda} filtro={filtro} />}
          renderItem={({ item, index }) => (
            <AnimatedCard index={index}>
              <IncidenciaCard {...item} />
            </AnimatedCard>
          )}
        />
      )}

      {/* ── FAB ── */}
      <Animated.View style={[styles.fab, { transform: [{ scale: fabScale }] }]}>
        <Pressable onPress={onFabPress} style={styles.fabInner}>
          <Ionicons name="add" size={28} color="#fff" />
        </Pressable>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },

  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    paddingHorizontal: 20,
    paddingTop:     56,
    paddingBottom:  16,
  },
  eyebrow: {
    fontSize:      11,
    fontWeight:    '700',
    letterSpacing:  1.4,
    color:         COLORS.accent,
    textTransform: 'uppercase',
    marginBottom:   2,
  },
  title: {
    fontSize:      28,
    fontWeight:    '800',
    color:         COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  totalBadge: {
    width:           44,
    height:          44,
    borderRadius:    22,
    backgroundColor: COLORS.surface,
    borderWidth:     1,
    borderColor:     COLORS.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  totalText: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },

  searchWrap: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   COLORS.surface,
    borderRadius:      14,
    marginHorizontal:  16,
    marginBottom:      12,
    paddingHorizontal: 14,
    paddingVertical:   10,
    borderWidth:       1,
    borderColor:       COLORS.border,
    gap:               10,
  },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary, padding: 0 },

  filtrosScroll:   { maxHeight: 48, marginBottom: 10 },
  filtrosContent:  { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  chip: {
    flexDirection:     'row',
    alignItems:        'center',
    backgroundColor:   COLORS.surface,
    borderRadius:      20,
    paddingVertical:   6,
    paddingHorizontal: 12,
    borderWidth:       1.5,
    borderColor:       COLORS.border,
    gap:               6,
  },
  chipLabel:     { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  chipCount:     { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1, backgroundColor: COLORS.surfaceHigh },
  chipCountText: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary },

  skeletonWrap: { paddingHorizontal: 16, gap: 10, marginTop: 4 },
  listContent:  { paddingHorizontal: 16, paddingBottom: 110, gap: 10 },

  fab: {
    position:      'absolute',
    bottom:        28,
    right:         20,
    shadowColor:   COLORS.accent,
    shadowOffset:  { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius:  12,
    elevation:     10,
    borderRadius:  30,
  },
  fabInner: {
    width:          60,
    height:         60,
    borderRadius:   30,
    backgroundColor: COLORS.accent,
    alignItems:     'center',
    justifyContent: 'center',
  },
});
