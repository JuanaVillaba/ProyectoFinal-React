import Screen from "@/components/ui/Screen"
import { useRouter, Stack } from "expo-router"
import { Text } from "react-native"
import { TextInput, Button } from "react-native-paper"
export default function RegistrarUsuarioScreen(){
    const router= useRouter();
    return (
        <Screen>
            <Stack.Screen options={{ headerTitleAlign: "center"}}/>
            <Text>Ingrese nombre: </Text>
            <TextInput placeholder="Ingrese nombre"></TextInput>
            <Text>Ingrese correo electronico: </Text>
            <TextInput placeholder="Ingrese corro electronico"></TextInput>
            <Text>Ingrese contraseña: </Text>
            <TextInput placeholder="Ingrese contraseña"></TextInput>
            <Text>Ingrese direccion: </Text>
            <TextInput placeholder="Ingrese direccion"></TextInput>
            <Text>Ingrese piso: </Text>
            <TextInput placeholder="Ingrese piso"></TextInput>
            <Text>Ingrese letra o numero: </Text>
            <TextInput placeholder="Ingrese letra o numero"></TextInput>
            <Button onPress={() => router.push("/(tabs)")}>Registrar</Button>
        </Screen>
    )
}