import Screen from "@/components/ui/Screen"
import { useRouter, Stack } from "expo-router"
import { Text } from "react-native"
import { TextInput, Button, Card, Checkbox } from "react-native-paper"
import { StyleSheet, Image, View } from "react-native";
import perfil from "assets/img/usuario-perfil.jpg";
import { useState } from "react"
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function IniciarSesion() {
    const router = useRouter();
    const { signIn, loading, error, session } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [guardar, setGuardar] = useState(false);

    const iniciar = async () => {
        try {
            await signIn({ email, password });
            router.replace("/(tabs)");
        } catch (e: any) {
            alert("Correo o contraseña incorrecta");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={["#0f1b35", "#1a2d5a", "#1e3a6e"]} style={styles.fondo}>
                <View style={styles.centrar}>
                    <Card style={styles.card}>
                        <Image style={styles.imagen} source={perfil} />
                        <TextInput
                            style={styles.inputs}
                            onChangeText={(valor: string) => setEmail(valor)}
                            value={email}
                            placeholder="Correo electrónico"
                            placeholderTextColor="#8faecf"
                        />
                        <TextInput
                            style={styles.inputs}
                            onChangeText={(valor: string) => setPassword(valor)}
                            value={password}
                            secureTextEntry
                            placeholder="Contraseña"
                            placeholderTextColor="#8faecf"
                        />
                        <View style={styles.guardarOlvidar}>
                            <View style={styles.guardar}>
                                <Checkbox
                                    status={guardar ? "checked" : "unchecked"}
                                    onPress={() => setGuardar(!guardar)}
                                    color="#4338ca"
                                />
                                <Text style={styles.guardarTexto}>Guardar sesión</Text>
                            </View>
                            <Text style={styles.olvidar}>¿Olvidaste la contraseña?</Text>
                        </View>
                    </Card>

                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.textoBoton}
                        contentStyle={styles.buttonContent}
                        onPress={iniciar}
                        loading={loading}
                        disabled={loading}
                    >
                        Iniciar Sesión
                    </Button>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
    },
    centrar: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: 360,
        borderRadius: 20,
        paddingBottom: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 12,
    },
    imagen: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginTop: 28,
        marginBottom: 24,
        alignSelf: "center",
        borderWidth: 3,
        borderColor: "#4338ca",
    },
    inputs: {
        marginHorizontal: 20,
        marginBottom: 12,
        backgroundColor: "#f4f6fb",
        borderRadius: 12,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        fontSize: 14,
    },
    guardarOlvidar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 16,
    },
    guardar: {
        flexDirection: "row",
        alignItems: "center",
    },
    guardarTexto: {
        fontSize: 13,
        color: "#374151",
    },
    olvidar: {
        fontSize: 13,
        fontStyle: "italic",
        color: "#4338ca",
    },
    button: {
        marginTop: 16,
        backgroundColor: "#4338ca",
        width: "100%",
        maxWidth: 360,
        borderRadius: 14,
    },
    buttonContent: {
        paddingVertical: 6,
    },
    textoBoton: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 16,
        letterSpacing: 0.5,
    },
});