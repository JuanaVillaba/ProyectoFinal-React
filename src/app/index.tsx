import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import "../../assets/img/usuario-perfil.jpg"

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={['#0f1b35', '#1a2d5a', '#1e3a6e']} style={styles.container}>
      <View style={styles.inner}>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/img/usuario-perfil.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Textos */}
        <Text style={styles.appName}>IncidApp</Text>
        <Text style={styles.tagline}>Tu edificio, siempre conectado</Text>

        {/* Botones */}
        <View style={styles.buttons}>
          <Button
            mode="contained"
            onPress={() => router.push('/iniciar-sesion')}
            style={styles.btnPrimary}
            labelStyle={styles.btnPrimaryLabel}
            contentStyle={styles.btnContent}
          >
            Iniciar Sesión
          </Button>

          <Button
            mode="outlined"
            onPress={() => router.push('/registrar-usuario')}
            style={styles.btnSecondary}
            labelStyle={styles.btnSecondaryLabel}
            contentStyle={styles.btnContent}
          >
            Crear Cuenta
          </Button>
        </View>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },

  // Logo
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 28,
    // sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
  },

  // Textos
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#8faecf',
    marginBottom: 56,
    letterSpacing: 0.3,
  },

  // Botones
  buttons: {
    width: '100%',
    gap: 12,
  },
  btnContent: {
    paddingVertical: 6,
  },
  btnPrimary: {
    backgroundColor: '#4338ca',
    borderRadius: 14,
  },
  btnPrimaryLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  btnSecondary: {
    borderRadius: 14,
    borderColor: '#4a6fa5',
    borderWidth: 1.5,
  },
  btnSecondaryLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a8c4e0',
    letterSpacing: 0.5,
  },
});