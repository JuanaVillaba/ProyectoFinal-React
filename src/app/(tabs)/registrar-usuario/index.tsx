import Screen from "@/components/ui/Screen";
import { useRouter, Stack } from "expo-router";
import { Text } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { StyleSheet, Image, View } from "react-native";
export default function RegistrarUsuarioScreen() {
    const router = useRouter();
    const styles = StyleSheet.create({
        card: {
            backgroundColor: "#EBDBFE",
        },
        inputs: {
            width: 300,
            alignSelf: "center",
            backgroundColor: "white",
            marginBottom: 15
        },
        button: {
            marginTop: 15,
            backgroundColor: "#D2AFFD"
        },
        centrar: {
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
        },
        titulo: {
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 20
        },
        aceptar: {
            flexDirection: "row",
            alignSelf:"center",
            marginBottom: 15
        },
        texto:{
            fontSize: 19
        }
    });

    return (
        <Screen>
            <Stack.Screen options={{ headerTitleAlign: "center" }} />
            <Card style={styles.card}>
                <Text style={styles.titulo}>Iniciar sesion</Text>
                <TextInput style={styles.inputs} placeholder="Ingrese nombre"></TextInput>

                <TextInput style={styles.inputs} placeholder="Ingrese corro electronico"></TextInput>

                <TextInput style={styles.inputs} placeholder="Ingrese contraseña"></TextInput>

                <TextInput style={styles.inputs} placeholder="Ingrese direccion"></TextInput>

                <TextInput style={styles.inputs} placeholder="Ingrese piso"></TextInput>

                <TextInput style={styles.inputs} placeholder="Ingrese letra o numero"></TextInput>
                <View style={styles.aceptar}>
                    <input type="checkbox" id="" />
                    <Text style={styles.texto}>Acepta los terminos y condiciones</Text>
                </View>

            </Card>

            <Button style={styles.button} onPress={() => router.push("/(tabs)")}>Registrar</Button>
        </Screen>
    )
}