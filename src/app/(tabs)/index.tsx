import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Screen from '@/components/ui/Screen';

import { crearReserva } from '@/services/reservas';
import { registrarUsuario } from '@/services/usuarios';
// ─── Paleta central ───────────────────────────────────────────────────────────
const C = {
  navy:        '#1a2744',
  navyLight:   '#243460',
  accent:      '#4f6ef7',
  accentSoft:  '#eef1fe',
  bg:          '#f4f6fb',
  surface:     '#ffffff',
  border:      '#e8eaf0',
  textPrimary: '#0f172a',
  textSecond:  '#64748b',
  textMuted:   '#94a3b8',
  green:       '#22c55e',
  greenBg:     '#f0fdf4',
  orange:      '#f97316',
  orangeBg:    '#fff7ed',
  red:         '#ef4444',
  redBg:       '#fef2f2',
  yellow:      '#eab308',
  yellowBg:    '#fefce8',
  blue:        '#3b82f6',
  blueBg:      '#eff6ff',
  purple:      '#8b5cf6',
  purpleBg:    '#f5f3ff',
};

// ─── Tipos ────────────────────────────────────────────────────────────────────
type QuickAction = {
  label:     string;
  sublabel:  string;
  icon:      React.ComponentProps<typeof Ionicons>['name'];
  bg:        string;
  iconColor: string;
  route:     string;
  badge?:    string;
};

type Incidencia = {
  id:       string;
  titulo:   string;
  numero:   string;
  tiempo:   string;
  estado:   'en_proceso' | 'pendiente' | 'resuelto';
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg:    string;
};

type Evento = {
  titulo:   string;
  fecha:    string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
};

// ─── Datos mock ───────────────────────────────────────────────────────────────
const QUICK_ACTIONS: QuickAction[] = [
  {
    label:     'Reportar',
    sublabel:  'Incidencia',
    icon:      'construct-outline',
    bg:        C.accentSoft,
    iconColor: C.accent,
    route:     '/(tabs)/incidencia',
  },
  {
    label:     'Avisos',
    sublabel:  '2 sin leer',
    icon:      'megaphone-outline',
    bg:        C.orangeBg,
    iconColor: C.orange,
    route:     '/(tabs)/avisos',
    badge:     '2',
  },
  {
    label:     'Reservas',
    sublabel:  'SUM y espacios',
    icon:      'calendar-outline',
    bg:        C.greenBg,
    iconColor: C.green,
    route:     '/(tabs)/reservas',
  },
  {
    label:     'Visitas',
    sublabel:  'Autorizar acceso',
    icon:      'people-outline',
    bg:        C.purpleBg,
    iconColor: C.purple,
    route:     '/(tabs)/servicios',
  },
];

const INCIDENCIAS: Incidencia[] = [
  {
    id:        '1',
    titulo:    'Sin agua caliente - Piso 3',
    numero:    '#1245',
    tiempo:    'hace 2 h',
    estado:    'en_proceso',
    iconName:  'water-outline',
    iconColor: C.red,
    iconBg:    C.redBg,
  },
  {
    id:        '2',
    titulo:    'Luz del pasillo fundida',
    numero:    '#1244',
    tiempo:    'hace 1 día',
    estado:    'pendiente',
    iconName:  'bulb-outline',
    iconColor: C.yellow,
    iconBg:    C.yellowBg,
  },
  {
    id:        '3',
    titulo:    'Ascensor fuera de servicio',
    numero:    '#1243',
    tiempo:    'hace 3 días',
    estado:    'resuelto',
    iconName:  'checkbox-outline',
    iconColor: C.green,
    iconBg:    C.greenBg,
  },
];

const EVENTOS: Evento[] = [
  {
    titulo:   'Mantenimiento de ascensores',
    fecha:    'Sáb 25 de mayo · 8:00 a 12:00 hs',
    iconName: 'calendar-outline',
  },
  {
    titulo:   'Asamblea de consorcio',
    fecha:    'Jue 5 de jun · 19:00 hs',
    iconName: 'people-circle-outline',
  },
];

// ─── Helpers de estado ────────────────────────────────────────────────────────
const ESTADO_CONFIG = {
  en_proceso: { label: 'En proceso', bg: C.blueBg,   color: C.blue   },
  pendiente:  { label: 'Pendiente',  bg: C.yellowBg, color: C.yellow },
  resuelto:   { label: 'Resuelta',   bg: C.greenBg,  color: C.green  },
};

// ─── Componente: Acción rápida ────────────────────────────────────────────────
function ActionCard({ action, index }: { action: QuickAction; index: number }) {
  const router  = useRouter();
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const transY  = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 350, delay: 100 + index * 70, useNativeDriver: true }),
      Animated.timing(transY,  { toValue: 0, duration: 350, delay: 100 + index * 70, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[s.actionWrap, { opacity, transform: [{ translateY: transY }, { scale }] }]}>
      <TouchableOpacity
        style={[s.actionCard, { backgroundColor: action.bg }]}
        onPress={() => router.push(action.route as any)}
        onPressIn={() => Animated.spring(scale, { toValue: 0.93, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start()}
        activeOpacity={1}
      >
        {/* Badge de notificación */}
        {action.badge && (
          <View style={s.actionBadge}>
            <Text style={s.actionBadgeText}>{action.badge}</Text>
          </View>
        )}

        <View style={[s.actionIconWrap, { backgroundColor: action.iconColor + '18' }]}>
          <Ionicons name={action.icon} size={22} color={action.iconColor} />
        </View>

        <Text style={[s.actionLabel, { color: C.textPrimary }]}>{action.label}</Text>
        <Text style={[s.actionSub,   { color: action.iconColor }]}>{action.sublabel}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Componente: Fila de incidencia ──────────────────────────────────────────
function IncidenciaRow({ item, index }: { item: Incidencia; index: number }) {
  const router  = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const transX  = useRef(new Animated.Value(16)).current;
  const cfg     = ESTADO_CONFIG[item.estado];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, delay: 300 + index * 80, useNativeDriver: true }),
      Animated.timing(transX,  { toValue: 0, duration: 320, delay: 300 + index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX: transX }] }}>
      <TouchableOpacity
        style={s.incRow}
        onPress={() => router.push('/(tabs)/incidencia' as any)}
        activeOpacity={0.75}
      >
        <View style={[s.incIconWrap, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.iconName} size={18} color={item.iconColor} />
        </View>

        <View style={s.incText}>
          <Text style={s.incTitle} numberOfLines={1}>{item.titulo}</Text>
          <Text style={s.incMeta}>{item.numero} · Reportada {item.tiempo}</Text>
        </View>

        <View style={[s.estadoBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[s.estadoText, { color: cfg.color }]}>{cfg.label}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Componente: Evento ───────────────────────────────────────────────────────
function EventoRow({ evento }: { evento: Evento }) {
  return (
    <View style={s.eventoRow}>
      <View style={s.eventoIconWrap}>
        <Ionicons name={evento.iconName} size={18} color={C.accent} />
      </View>
      <View style={s.eventoText}>
        <Text style={s.eventoTitle}>{evento.titulo}</Text>
        <Text style={s.eventoFecha}>{evento.fecha}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function Home() {
  const router     = useRouter();
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const headerTranslate = headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-16, 0] });

  return (
    <Screen noPadding>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* ── Header ── */}
        <Animated.View style={[s.header, { opacity: headerAnim, transform: [{ translateY: headerTranslate }] }]}>
          <View style={s.headerTop}>
            <View>
              <Text style={s.headerSup}>Residencial Belgrano</Text>
              <Text style={s.headerTitle}>Hola, vecino 3B 👋</Text>
            </View>
            <TouchableOpacity style={s.bellBtn} onPress={() => {}}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {/* Dot de notificación */}
              <View style={s.bellDot} />
            </TouchableOpacity>
          </View>

          {/* Sub-info: piso + estado */}
          <View style={s.headerMeta}>
            <View style={s.metaPill}>
              <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.7)" />
              <Text style={s.metaText}>Torre A · Piso 3</Text>
            </View>
            <View style={s.statusPill}>
              <View style={s.statusDot} />
              <Text style={s.statusText}>Todo en orden</Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Banner hero ── */}
        <View style={s.heroBanner}>
          <View style={s.heroContent}>
            <Text style={s.heroTitle}>Bienvenido a{'\n'}Residencial Belgrano</Text>
            <Text style={s.heroSub}>Todo lo que necesitás para{'\n'}vivir mejor, en un solo lugar.</Text>
          </View>
          {/* Decoración geométrica */}
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />
          <Ionicons name="business-outline" size={80} color="rgba(255,255,255,0.12)" style={s.heroIcon} />
        </View>

        {/* ── Accesos rápidos ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Accesos rápidos</Text>
          <View style={s.grid}>
            {QUICK_ACTIONS.map((a, i) => (
              <ActionCard key={a.label} action={a} index={i} />
            ))}
          </View>
        </View>

        {/* ── Incidencias recientes ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Incidencias recientes</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/incidencia' as any)}>
              <Text style={s.verTodas}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {INCIDENCIAS.map((item, i) => (
              <React.Fragment key={item.id}>
                <IncidenciaRow item={item} index={i} />
                {i < INCIDENCIAS.length - 1 && <View style={s.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Próximos eventos / avisos ── */}
        <View style={[s.section, { marginBottom: 32 }]}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Próximos eventos / avisos</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/avisos' as any)}>
              <Text style={s.verTodas}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {EVENTOS.map((ev, i) => (
              <React.Fragment key={ev.titulo}>
                <EventoRow evento={ev} />
                {i < EVENTOS.length - 1 && <View style={s.divider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

      </ScrollView>
    </Screen>
    
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  scroll: { paddingBottom: 16 },

  // Header
  header: {
    backgroundColor:   C.navy,
    paddingHorizontal: 20,
    paddingTop:        16,
    paddingBottom:     20,
    gap:               14,
  },
  headerTop: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'flex-start',
  },
  headerSup: {
    color:         'rgba(255,255,255,0.5)',
    fontSize:      11,
    fontWeight:    '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom:  4,
  },
  headerTitle: {
    color:      '#fff',
    fontSize:   26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  bellBtn: {
    width:           42,
    height:          42,
    borderRadius:    21,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       4,
  },
  bellDot: {
    position:        'absolute',
    top:             9,
    right:           9,
    width:           8,
    height:          8,
    borderRadius:    4,
    backgroundColor: C.orange,
    borderWidth:     1.5,
    borderColor:     C.navy,
  },
  headerMeta: {
    flexDirection: 'row',
    gap:           10,
    alignItems:    'center',
  },
  metaPill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    backgroundColor:   'rgba(255,255,255,0.08)',
    borderRadius:      20,
    paddingVertical:   5,
    paddingHorizontal: 10,
  },
  metaText: {
    color:      'rgba(255,255,255,0.7)',
    fontSize:   11,
    fontWeight: '500',
  },
  statusPill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor:   'rgba(255,255,255,0.08)',
    borderRadius:      20,
    paddingVertical:   5,
    paddingHorizontal: 10,
  },
  statusDot: {
    width:           7,
    height:          7,
    borderRadius:    4,
    backgroundColor: C.green,
  },
  statusText: {
    color:      'rgba(255,255,255,0.8)',
    fontSize:   11,
    fontWeight: '500',
  },

  // Hero banner
  heroBanner: {
    backgroundColor:   C.navyLight,
    marginHorizontal:  16,
    marginTop:         16,
    borderRadius:      20,
    padding:           20,
    overflow:          'hidden',
    minHeight:         110,
    justifyContent:    'center',
  },
  heroContent: { zIndex: 1 },
  heroTitle: {
    color:      '#fff',
    fontSize:   18,
    fontWeight: '800',
    lineHeight: 24,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  heroSub: {
    color:      'rgba(255,255,255,0.65)',
    fontSize:   12,
    lineHeight: 17,
  },
  heroCircle1: {
    position:        'absolute',
    width:           130,
    height:          130,
    borderRadius:    65,
    backgroundColor: 'rgba(79,110,247,0.25)',
    right:           -20,
    top:             -30,
  },
  heroCircle2: {
    position:        'absolute',
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: 'rgba(79,110,247,0.15)',
    right:           50,
    bottom:          -20,
  },
  heroIcon: {
    position: 'absolute',
    right:    10,
    bottom:   -2,
  },

  // Secciones
  section: {
    paddingHorizontal: 16,
    paddingTop:        24,
    gap:               12,
  },
  sectionHeader: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  sectionTitle: {
    fontSize:   14,
    fontWeight: '700',
    color:      C.textPrimary,
    letterSpacing: -0.1,
  },
  verTodas: {
    fontSize:   13,
    fontWeight: '600',
    color:      C.accent,
  },

  // Grid accesos rápidos
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },
  actionWrap: { width: '47.5%' },
  actionCard: {
    borderRadius: 18,
    padding:      16,
    gap:          8,
    position:     'relative',
  },
  actionBadge: {
    position:        'absolute',
    top:             10,
    right:           10,
    backgroundColor: C.orange,
    borderRadius:    10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth:        18,
    alignItems:      'center',
  },
  actionBadgeText: {
    color:      '#fff',
    fontSize:   10,
    fontWeight: '800',
  },
  actionIconWrap: {
    width:          42,
    height:         42,
    borderRadius:   13,
    alignItems:     'center',
    justifyContent: 'center',
    marginBottom:   2,
  },
  actionLabel: {
    fontSize:   15,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  actionSub: {
    fontSize:   12,
    fontWeight: '500',
  },

  // Card contenedor (incidencias + eventos)
  card: {
    backgroundColor: C.surface,
    borderRadius:    18,
    borderWidth:     1,
    borderColor:     C.border,
    overflow:        'hidden',
  },
  divider: {
    height:          1,
    backgroundColor: C.border,
    marginLeft:      62,
  },

  // Fila incidencia
  incRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       14,
    gap:           12,
  },
  incIconWrap: {
    width:          38,
    height:         38,
    borderRadius:   19,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  incText: { flex: 1 },
  incTitle: {
    fontSize:   13,
    fontWeight: '600',
    color:      C.textPrimary,
    marginBottom: 2,
  },
  incMeta: {
    fontSize: 11,
    color:    C.textMuted,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      99,
    flexShrink:        0,
  },
  estadoText: {
    fontSize:   10,
    fontWeight: '700',
  },

  // Fila evento
  eventoRow: {
    flexDirection: 'row',
    alignItems:    'center',
    padding:       14,
    gap:           12,
  },
  eventoIconWrap: {
    width:          38,
    height:         38,
    borderRadius:   19,
    backgroundColor: C.accentSoft,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  eventoText:  { flex: 1 },
  eventoTitle: {
    fontSize:   13,
    fontWeight: '600',
    color:      C.textPrimary,
    marginBottom: 2,
  },
  eventoFecha: {
    fontSize: 11,
    color:    C.textMuted,
  },
});
