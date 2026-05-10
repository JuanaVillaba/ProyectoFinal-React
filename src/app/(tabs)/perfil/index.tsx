import { View, StyleSheet } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import Screen from '@/components/ui/Screen';
import { Text, Button, Avatar, Card } from 'react-native-paper';
import { useRouter} from "expo-router";

export default function PerfilScreen() {

  const styles = StyleSheet.create({
    contenedor: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    card: {
      backgroundColor: '#EBDBFE',
      padding: 20,
      marginBottom: 30,
    },
    centrar: {
      alignItems: 'center',
    },
    avatar: {
      backgroundColor: '#6422b4',
      marginBottom: 15,
    },
    nombre: {
      fontWeight: 'bold',
      color: '#2D3748',
    },
    email: {
      color: '#718096',
    },
    boton: {
      marginTop: 10,
    }
  });
  const { signOut, session, loading } = useAuth();
  const nombre = session?.user?.user_metadata?.nombre || "Usuario";
  const apellido = session?.user?.user_metadata?.apellido || "";
  const email = session?.user?.email;
  const router = useRouter();
  const manejarCerrarSesion = async () => {
    try {
      await signOut();
      router.replace("/")
    } catch (e: any) {
      console.error("Error al cerrar sesión:", e.message);
    }
  }
  return (
    <Screen>
      <View style={styles.contenedor}>
        <Card style={styles.card}>
          <Card.Content style={styles.centrar}>
            <Avatar.Text size={80} label={nombre.substring(0, 1)} style={styles.avatar} />
            <Text variant="headlineMedium" style={styles.nombre}>
              {nombre} {apellido}
            </Text>
            <Text variant="bodyLarge" style={styles.email}>
              {email}
            </Text>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={manejarCerrarSesion}
          style={styles.boton}
          buttonColor="#FF5252"
          loading={loading}
        >
          Cerrar Sesión
        </Button>
      </View>
    </Screen>
  );
}


