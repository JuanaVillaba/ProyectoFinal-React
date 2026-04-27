import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import Screen from '@/components/ui/Screen';
import EstadoBadge from '@/components/incidencia/EstadoBadge';
import { incidenciasMock } from '@/features/incidencias/mock';
import { Incidencia } from '@/features/incidencias/mock';
import { Stack } from 'expo-router';

export default function IncidenciaDetalle() {
  const params = useLocalSearchParams<{ id: string }>();

  const incidencia: Incidencia | undefined = useMemo(() => {
    return incidenciasMock.find((i) => i.id === params.id);
  }, [params.id]);

  if (!incidencia) {
    return (
      <Screen>
        <Text style={styles.notFound}>Incidencia no encontrada</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{title:"Incidente", headerTitleAlign:"center",}}/>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{incidencia.titulo}</Text>
          
          
          
          
          <EstadoBadge estado={incidencia.estado} />
        </View>
        <Text>Servicio: {incidencia.servicio}</Text>
        <Text>Fecha del reporte: {incidencia.fecha}</Text>
        {/* Descripción */}
        <Section title="Descripción">
          <Text style={styles.text}>{incidencia.descripcion}</Text>
        </Section>

        {/* Fecha */}
        <Section title="Fecha">
          <Text style={styles.text}>{formatFecha(incidencia.fecha)}</Text>
        </Section>

        <Text style={styles.texto}>Estado actual</Text>
        {/* Timeline */}
        <Section title="">
          <Timeline estado={incidencia.estado} />
        </Section>
      </View>
    </Screen>
  );
}

// 🧩 COMPONENTES INTERNOS (limpios y reutilizables)

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Timeline({ estado }: { estado: string }) {
  const steps = [
    { label: 'Reportada', key: 'pendiente' },
    { label: 'En proceso', key: 'en_proceso' },
    { label: 'Resuelta', key: 'resuelto' },
  ];

  const currentIndex = steps.findIndex((s) => s.key === estado);

  return (
    <View style={styles.timeline}>
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;

        return (
          <View key={step.key} style={styles.timelineRow}>
            <View
              style={[
                styles.dot,
                { backgroundColor: isActive ? '#3b82f6' : '#ccc' },
              ]}
            />
            <Text
              style={[
                styles.timelineText,
                { color: isActive ? '#000' : '#aaa' },
              ]}
            >
              {step.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// 🧠 UTILIDAD

function formatFecha(fecha: string) {
  const date = new Date(fecha);
  return date.toLocaleDateString();
}

// 🎨 STYLES

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
  },

  section: {
    gap: 6,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  text: {
    color: '#555',
  },

  timeline: {
    gap: 10,
  },

  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  timelineText: {
    fontSize: 14,
  },

  notFound: {
    textAlign: 'center',
    marginTop: 50,
  },
  texto:{
            fontWeight: "bold",
            marginTop: 5,
            marginBottom:5  
        },
});