import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';

import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import Screen from '@/components/ui/Screen';
import { supabase } from '@/lib/supabase';

const C = {
  navy: '#1a2744',
  navyLight: '#243460',
  accent: '#4f6ef7',
  accentSoft: '#eef1fe',
  surface: '#fff',
  border: '#e8eaf0',
  textPrimary: '#0f172a',
  textMuted: '#94a3b8',
  green: '#22c55e',
  greenBg: '#f0fdf4',
  orange: '#f97316',
  orangeBg: '#fff7ed',
  red: '#ef4444',
  redBg: '#fef2f2',
  yellow: '#eab308',
  yellowBg: '#fefce8',
  blue: '#3b82f6',
  blueBg: '#eff6ff',
};

type Estado = 'en_proceso' | 'pendiente' | 'resuelto';

type QuickAction = {
  label: string;
  sublabel: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  bg: string;
  iconColor: string;
  route: string;
  badge?: string;
};

type Incidencia = {
  id: string;
  titulo: string;
  numero: string;
  tiempo: string;
  estado: Estado;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  iconColor: string;
  iconBg: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: 'Reportar',
    sublabel: 'Incidencia',
    icon: 'construct-outline',
    bg: C.accentSoft,
    iconColor: C.accent,
    route: '/(tabs)/incidencia',
  },
  {
    label: 'Avisos',
    sublabel: '2 sin leer',
    icon: 'megaphone-outline',
    bg: C.orangeBg,
    iconColor: C.orange,
    route: '/(tabs)/avisos',
    badge: '2',
  },
  {
    label: 'Reservas',
    sublabel: 'SUM y espacios',
    icon: 'calendar-outline',
    bg: C.greenBg,
    iconColor: C.green,
    route: '/(tabs)/reservas',
  },
];

const EVENTOS = [
  {
    titulo: 'Mantenimiento de ascensores',
    fecha: 'Sáb 25 de mayo · 8:00 a 12:00 hs',
    iconName: 'calendar-outline',
  },
  {
    titulo: 'Asamblea de consorcio',
    fecha: 'Jue 5 de jun · 19:00 hs',
    iconName: 'people-circle-outline',
  },
];

const ESTADO = {
  en_proceso: {
    label: 'En proceso',
    bg: C.blueBg,
    color: C.blue,
    iconName: 'alert-circle-outline',
    iconColor: C.red,
    iconBg: C.redBg,
  },
  pendiente: {
    label: 'Pendiente',
    bg: C.yellowBg,
    color: C.yellow,
    iconName: 'time-outline',
    iconColor: C.yellow,
    iconBg: C.yellowBg,
  },
  resuelto: {
    label: 'Resuelta',
    bg: C.greenBg,
    color: C.green,
    iconName: 'checkmark-circle-outline',
    iconColor: C.green,
    iconBg: C.greenBg,
  },
} as const;

const tiempo = (fecha: string) => {
  const diff = Date.now() - new Date(fecha).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);

  if (m < 60) return `hace ${m} min`;
  if (h < 24) return `hace ${h} h`;

  return `hace ${d} día${d > 1 ? 's' : ''}`;
};

const animar = (
  value: Animated.Value,
  toValue: number,
  delay = 0
) =>
  Animated.timing(value, {
    toValue,
    duration: 350,
    delay,
    useNativeDriver: true,
  });

function ActionCard({
  action,
  index,
  full,
}: {
  action: QuickAction;
  index: number;
  full?: boolean;
}) {
  const router = useRouter();

  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const y = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      animar(opacity, 1, 100 + index * 70),
      animar(y, 0, 100 + index * 70),
    ]).start();
  }, []);

  return (
    <View style={[s.actionWrap, full && s.full]}>
      <Animated.View
        style={{
          opacity,
          transform: [{ translateY: y }, { scale }],
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => router.push(action.route as any)}
          onPressIn={() =>
            Animated.spring(scale, {
              toValue: 0.97,
              useNativeDriver: true,
            }).start()
          }
          onPressOut={() =>
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
            }).start()
          }
          style={[
            s.actionCard,
            { backgroundColor: action.bg },
            full && s.actionCardFull,
          ]}
        >
          {!!action.badge && (
            <View style={s.badge}>
              <Text style={s.badgeText}>
                {action.badge}
              </Text>
            </View>
          )}

          <View
            style={[
              s.actionIcon,
              {
                backgroundColor:
                  action.iconColor + '18',
              },
            ]}
          >
            <Ionicons
              name={action.icon}
              size={22}
              color={action.iconColor}
            />
          </View>

          <View style={full && { flex: 1 }}>
            <Text style={s.actionLabel}>
              {action.label}
            </Text>

            <Text
              style={[
                s.actionSub,
                { color: action.iconColor },
              ]}
            >
              {action.sublabel}
            </Text>
          </View>

          {full && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={C.green}
            />
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function IncidenciaRow({
  item,
  index,
}: {
  item: Incidencia;
  index: number;
}) {
  const router = useRouter();

  const opacity = useRef(new Animated.Value(0)).current;
  const x = useRef(new Animated.Value(16)).current;

  const cfg = ESTADO[item.estado];

  useEffect(() => {
    Animated.parallel([
      animar(opacity, 1, 300 + index * 80),
      animar(x, 0, 300 + index * 80),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateX: x }],
      }}
    >
      <TouchableOpacity
        activeOpacity={0.75}
        style={s.incRow}
        onPress={() =>
          router.push('/(tabs)/incidencia' as any)
        }
      >
        <View
          style={[
            s.incIcon,
            { backgroundColor: item.iconBg },
          ]}
        >
          <Ionicons
            name={item.iconName}
            size={18}
            color={item.iconColor}
          />
        </View>

        <View style={{ flex: 1 }}>
          <Text
            style={s.incTitle}
            numberOfLines={1}
          >
            {item.titulo}
          </Text>

          <Text style={s.incMeta}>
            {item.numero} · Reportada{' '}
            {item.tiempo}
          </Text>
        </View>

        <View
          style={[
            s.estado,
            { backgroundColor: cfg.bg },
          ]}
        >
          <Text
            style={[
              s.estadoText,
              { color: cfg.color },
            ]}
          >
            {cfg.label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const EventoRow = ({ evento }: any) => (
  <View style={s.eventoRow}>
    <View style={s.eventoIcon}>
      <Ionicons
        name={evento.iconName}
        size={18}
        color={C.accent}
      />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={s.incTitle}>
        {evento.titulo}
      </Text>

      <Text style={s.incMeta}>
        {evento.fecha}
      </Text>
    </View>

    <Ionicons
      name="chevron-forward"
      size={16}
      color={C.textMuted}
    />
  </View>
);

export default function Home() {
  const router = useRouter();

  const header = useRef(
    new Animated.Value(0)
  ).current;

  const [loading, setLoading] =
    useState(true);

  const [incidencias, setIncidencias] =
    useState<Incidencia[]>([]);

  const cargarIncidencias = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('fecha', {
          ascending: false,
        })
        .limit(3);

      if (error) return console.log(error);

      setIncidencias(
        (data || []).map((item: any) => {
          const estado: Estado =
            item.estado === 'resuelto'
              ? 'resuelto'
              : item.estado === 'pendiente'
              ? 'pendiente'
              : 'en_proceso';

          return {
            id: item.id,
            titulo:
              item.titulo ||
              item.descripcion ||
              'Incidencia',

            numero: `#${String(item.id).slice(
              0,
              6
            )}`,

            tiempo: tiempo(item.fecha),

            estado,

            ...ESTADO[estado],
          };
        })
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    animar(header, 1).start();

    cargarIncidencias();

    const channel = supabase
      .channel('home-incidents')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
        },
        cargarIncidencias
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Screen noPadding>
      <StatusBar
        barStyle="light-content"
        backgroundColor={C.navy}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Animated.View
          style={[
            s.header,
            {
              opacity: header,
              transform: [
                {
                  translateY:
                    header.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-16, 0],
                    }),
                },
              ],
            },
          ]}
        >
          <View style={s.rowBetween}>
            <View>
              <Text style={s.headerSup}>
                Residencial Belgrano
              </Text>

              <Text style={s.headerTitle}>
                Hola, vecino 👋
              </Text>
            </View>

            <TouchableOpacity style={s.bell}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#fff"
              />

              <View style={s.bellDot} />
            </TouchableOpacity>
          </View>

          <View style={s.headerMeta}>
            <View style={s.pill}>
              <Ionicons
                name="location-outline"
                size={12}
                color="rgba(255,255,255,.7)"
              />

              <Text style={s.metaText}>
                Torre A · Piso 3
              </Text>
            </View>

            <View style={s.pill}>
              <View style={s.statusDot} />

              <Text style={s.metaText}>
                Todo en orden
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={s.hero}>
          <View style={{ zIndex: 1 }}>
            <Text style={s.heroTitle}>
              Bienvenido a{'\n'}
              Residencial Belgrano
            </Text>

            <Text style={s.heroSub}>
              Todo lo que necesitás para{'\n'}
              vivir mejor, en un solo lugar.
            </Text>
          </View>

          <View style={s.circle1} />
          <View style={s.circle2} />

          <Ionicons
            name="business-outline"
            size={80}
            color="rgba(255,255,255,.12)"
            style={s.heroIcon}
          />
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>
            Accesos rápidos
          </Text>

          <View style={s.grid}>
            {QUICK_ACTIONS.map((a, i) => (
              <ActionCard
                key={a.label}
                action={a}
                index={i}
                full={
                  QUICK_ACTIONS.length % 2 !==
                    0 &&
                  i ===
                    QUICK_ACTIONS.length - 1
                }
              />
            ))}
          </View>
        </View>

        <View style={s.section}>
          <View style={s.rowBetween}>
            <Text style={s.sectionTitle}>
              Incidencias recientes
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  '/(tabs)/incidencia' as any
                )
              }
            >
              <Text style={s.verTodas}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {loading ? (
              <Text style={s.empty}>
                Cargando incidencias...
              </Text>
            ) : incidencias.length ? (
              incidencias.map((item, i) => (
                <React.Fragment key={item.id}>
                  <IncidenciaRow
                    item={item}
                    index={i}
                  />

                  {i <
                    incidencias.length - 1 && (
                    <View style={s.divider} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Text style={s.empty}>
                No hay incidencias recientes
              </Text>
            )}
          </View>
        </View>

        <View
          style={[
            s.section,
            { marginBottom: 32 },
          ]}
        >
          <View style={s.rowBetween}>
            <Text style={s.sectionTitle}>
              Próximos eventos / avisos
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.push(
                  '/(tabs)/avisos' as any
                )
              }
            >
              <Text style={s.verTodas}>
                Ver todas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={s.card}>
            {EVENTOS.map((ev, i) => (
              <React.Fragment key={ev.titulo}>
                <EventoRow evento={ev} />

                {i < EVENTOS.length - 1 && (
                  <View style={s.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}

const center = {
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
};

const s = StyleSheet.create({
  scroll: { paddingBottom: 16 },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  header: {
    backgroundColor: C.navy,
    padding: 20,
    paddingTop: 16,
    gap: 14,
  },

  headerSup: {
    color: 'rgba(255,255,255,.5)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },

  bell: {
    ...center,
    width: 42,
    height: 42,
    borderRadius: 99,
    backgroundColor:
      'rgba(255,255,255,.1)',
  },

  bellDot: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: C.orange,
    borderWidth: 1.5,
    borderColor: C.navy,
  },

  headerMeta: {
    flexDirection: 'row',
    gap: 10,
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor:
      'rgba(255,255,255,.08)',
  },

  metaText: {
    color: 'rgba(255,255,255,.75)',
    fontSize: 11,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 99,
    backgroundColor: C.green,
  },

  hero: {
    backgroundColor: C.navyLight,
    margin: 16,
    marginBottom: 0,
    borderRadius: 20,
    padding: 20,
    minHeight: 110,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  heroTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },

  heroSub: {
    color: 'rgba(255,255,255,.65)',
    fontSize: 12,
    lineHeight: 17,
  },

  circle1: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 99,
    backgroundColor:
      'rgba(79,110,247,.25)',
    right: -20,
    top: -30,
  },

  circle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 99,
    backgroundColor:
      'rgba(79,110,247,.15)',
    right: 50,
    bottom: -20,
  },

  heroIcon: {
    position: 'absolute',
    right: 10,
    bottom: -2,
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: C.textPrimary,
  },

  verTodas: {
    fontSize: 13,
    fontWeight: '600',
    color: C.accent,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  actionWrap: { width: '47.5%' },
  full: { width: '100%' },

  actionCard: {
    padding: 16,
    borderRadius: 18,
    gap: 8,
  },

  actionCardFull: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 88,
  },

  actionIcon: {
    ...center,
    width: 42,
    height: 42,
    borderRadius: 13,
  },

  actionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.textPrimary,
  },

  actionSub: {
    fontSize: 12,
    fontWeight: '500',
  },

  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    minWidth: 18,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 99,
    backgroundColor: C.orange,
    ...center,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },

  card: {
    backgroundColor: C.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },

  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: 62,
  },

  incRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  incIcon: {
    ...center,
    width: 38,
    height: 38,
    borderRadius: 99,
  },

  incTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: C.textPrimary,
    marginBottom: 2,
  },

  incMeta: {
    fontSize: 11,
    color: C.textMuted,
  },

  estado: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },

  estadoText: {
    fontSize: 10,
    fontWeight: '700',
  },

  eventoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },

  eventoIcon: {
    ...center,
    width: 38,
    height: 38,
    borderRadius: 99,
    backgroundColor: C.accentSoft,
  },

  empty: {
    padding: 24,
    textAlign: 'center',
    color: C.textMuted,
  },
});