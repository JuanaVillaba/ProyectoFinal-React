import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import Screen from '@/components/ui/Screen';
import { useRouter } from 'expo-router';

export default function CrearIncidencia() {
  const router = useRouter();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleCrear = () => {
    if (!titulo || !descripcion) {
      Alert.alert('Error', 'Completá todos los campos');
      return;
    }

    // 🔥 Por ahora solo simulamos
    console.log({
      titulo,
      descripcion,
      estado: 'pendiente',
      fecha: new Date().toISOString(),
    });

    Alert.alert('Éxito', 'Incidencia creada');

    router.back(); // vuelve a la lista
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.label}>Título</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Sin agua caliente"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describí el problema..."
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
        />

        <Pressable style={styles.button} onPress={handleCrear}>
          <Text style={styles.buttonText}>Crear incidencia</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  label: {
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});