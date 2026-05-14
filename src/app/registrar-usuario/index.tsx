import Screen from "@/components/ui/Screen";
import { useRouter, Stack } from "expo-router";
import { Text } from "react-native";
import { TextInput, Button, Card, Checkbox } from "react-native-paper";
import { StyleSheet, Image, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function RegistrarUsuarioScreen() {
    const router = useRouter();
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [terminos, setTerminos] = useState(false);
    const { signUp, loading, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const options = {
        data: { nombre, apellido }
    };

    const registrar = async () => {
        if (!terminos) {
            alert("Debes aceptar los términos y condiciones para continuar.");
            return;
        }
        if (!email || !password || !nombre || !apellido) {
            alert("Por favor, completa todos los campos.");
            return;
        }
        try {
            await signUp({ email, password, options });
            router.replace("/(tabs)");
        } catch (e: any) {
            alert("Error al registrar: " + e.message);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <LinearGradient colors={["#0f1b35", "#1a2d5a", "#1e3a6e"]} style={styles.fondo}>
                <View style={styles.centrar}>
                    <Card style={styles.card}>
                        <Text style={styles.titulo}>Registrar usuario</Text>
                        <TextInput
                            style={styles.inputs}
                            value={nombre}
                            onChangeText={(valor: string) => setNombre(valor)}
                            placeholder="Nombre"
                            placeholderTextColor="#8faecf"
                        />
                        <TextInput
                            style={styles.inputs}
                            value={apellido}
                            onChangeText={(valor: string) => setApellido(valor)}
                            placeholder="Apellido"
                            placeholderTextColor="#8faecf"
                        />
                        <TextInput
                            style={styles.inputs}
                            value={email}
                            onChangeText={(valor: string) => setEmail(valor)}
                            keyboardType="email-address"
                            placeholder="Correo electrónico"
                            placeholderTextColor="#8faecf"
                        />
                        <TextInput
                            style={styles.inputs}
                            value={password}
                            onChangeText={(valor: string) => setPassword(valor)}
                            secureTextEntry
                            placeholder="Contraseña"
                            placeholderTextColor="#8faecf"
                        />
                        <View style={styles.aceptar}>
                            <Checkbox
                                status={terminos ? "checked" : "unchecked"}
                                onPress={() => setTerminos(!terminos)}
                                color="#4338ca"
                            />
                            <Text style={styles.textoTerminos}>Acepta los términos y condiciones</Text>
                        </View>
                    </Card>

                    <Button
                        mode="contained"
                        style={styles.button}
                        labelStyle={styles.textoBoton}
                        contentStyle={styles.buttonContent}
                        onPress={registrar}
                        loading={loading}
                        disabled={loading}
                    >
                        Registrar usuario
                    </Button>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        width: "100%",
        height: "100%",
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
    titulo: {
        fontWeight: "700",
        fontSize: 22,
        textAlign: "center",
        marginTop: 28,
        marginBottom: 20,
        color: "#1e3a6e",
        letterSpacing: 0.3,
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
    aceptar: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 16,
        marginTop: 4,
        marginBottom: 16,
    },
    textoTerminos: {
        fontSize: 13,
        color: "#374151",
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