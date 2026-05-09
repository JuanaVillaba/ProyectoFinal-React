/*import React from 'react';
import {View,
        Text, 
        StyleSheet,
        Alert,
        Pressable,} from 'react-native';
import Screen from '@/components/ui/Screen';
import BrandHeader from '@/components/ui/BrandHeader';
//import logo from '../../assets/logo.png';

import { crearReserva } from '@/services/reservas';
import { registrarUsuario } from '@/services/usuarios';

export default function Home() {
  return (
    <Screen>
      <BrandHeader
        title="Residencial"
        subtitle="Bienvenido, 3B 👋"
        //logo={logo}
      />
      <View style={styles.section}>
        <Text style={styles.title}>Accesos rápidos</Text>

        <View style={styles.grid}>
          <Text>🛠 Reportar</Text>
          <Text>📢 Avisos</Text>
          <Text>📅 Reservas</Text>
          <Text>👥 Visitas</Text>
        </View>
      </View>
    </Screen>
    
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
*/
import {View,
        Text, 
        StyleSheet,
        Alert,
        Pressable,} from 'react-native';
import Screen from '@/components/ui/Screen';
import BrandHeader from '@/components/ui/BrandHeader';
import { useRouter } from 'expo-router';   // ← agregá este import

export default function Home() {
  const router = useRouter();              // ← agregá esto

  return (
    <Screen>
      <BrandHeader
        title="Residencial"
        subtitle="Bienvenido, 3B 👋"
      />
      <View style={styles.section}>
        <Text style={styles.title}>Accesos rápidos</Text>

        <View style={styles.grid}>
          <Text>🛠 Reportar</Text>
          <Text>📢 Avisos</Text>

          {/* ← reemplazá el Text de Reservas por esto */}
          <Pressable onPress={() => router.push('/reserva')}>
            <Text>📅 Reservas</Text>
          </Pressable>

          <Text>👥 Visitas</Text>
        </View>
      </View>
    </Screen>
  );
}


const styles = StyleSheet.create({
  section: {
    marginTop: 20,                  
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});