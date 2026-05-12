import { View, StyleSheet, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
    const router = useRouter();
    const styles = StyleSheet.create({
        container: {
            flex: 1
        }, 
        centrar: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 30
        },
        titulo: {
            color: 'white',
            fontWeight: 'bold',
            marginBottom: 35
        },
        botonTamaño: {
            width: '100%',
            maxWidth: 300,
        },
        botonTexto: {
            marginBottom: 20,
            paddingVertical: 5,
            backgroundColor: "#9c52f7",
        },
        textoBoton:{
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
        }
    });
    return (
        <LinearGradient colors={["#3f7ae8", "#6422b4"]} style={styles.container}>
            <View style={styles.centrar}>
                <Text variant="displayMedium" style={styles.titulo}>¡Bienvenido!</Text>
                <View style={styles.botonTamaño}>
                    <Button
                        onPress={() => router.push("/iniciar-sesion")}
                        labelStyle={styles.textoBoton} style={styles.botonTexto}>
                        Iniciar Sesión
                    </Button>
                    <Button
                        onPress={() => router.push("/registrar-usuario")}
                        labelStyle={styles.textoBoton} style={[styles.botonTexto]}>
                        Crear Cuenta
                    </Button>
                </View>
            </View>
        </LinearGradient>
    );
}


