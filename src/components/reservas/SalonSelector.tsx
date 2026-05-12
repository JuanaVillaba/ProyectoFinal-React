// src/components/reservas/SalonSelector.tsx

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SALONES, type Salon } from "../../services/reservasService";

type Props = {
    salonActivo: string;
    onSeleccionar: (id: string) => void;
    };

    export function SalonSelector({ salonActivo, onSeleccionar }: Props) {
    return (
        <View style={styles.card}>
        <Text style={styles.label}>Seleccionar salón</Text>
        <View style={styles.grid}>
            {SALONES.map((salon) => (
            <SalonTile
                key={salon.id}
                salon={salon}
                activo={salon.id === salonActivo}
                onPress={() => onSeleccionar(salon.id)}
            />
            ))}
        </View>
        </View>
    );
    }

    // Tile individual — componente interno, no se exporta
    type TileProps = {
    salon: Salon;
    activo: boolean;
    onPress: () => void;
    };

    function SalonTile({ salon, activo, onPress }: TileProps) {
    return (
        <TouchableOpacity
        style={[styles.tile, activo && styles.tileActivo]}
        onPress={onPress}
        activeOpacity={0.7}
        >
        <Ionicons
            name={salon.icono as any}
            size={22}
            color={activo ? "#185FA5" : "#aaa"}
        />
        <Text style={[styles.tileNombre, activo && styles.tileNombreActivo]}>
            {salon.nombre}
        </Text>
        <Text style={[styles.tileCap, activo && styles.tileCapActivo]}>
            {salon.capacidad}
        </Text>
        </TouchableOpacity>
    );
    }

    const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 0.5,
        borderColor: "#e0e0e0",
        padding: 14,
        marginBottom: 8,
    },
    label: {
        fontSize: 10,
        fontWeight: "500",
        color: "#999",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 10,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    tile: {
        width: "48%",
        borderWidth: 1.5,
        borderColor: "#e0e0e0",
        borderRadius: 10,
        padding: 10,
        backgroundColor: "#fff",
    },
    tileActivo: {
        borderColor: "#185FA5",
        backgroundColor: "#E6F1FB",
    },
    tileNombre: {
        fontSize: 12,
        fontWeight: "500",
        color: "#1a1a1a",
        marginTop: 6,
        marginBottom: 2,
    },
    tileNombreActivo: {
        color: "#1a1a1a",
    },
    tileCap: {
        fontSize: 10,
        color: "#aaa",
    },
    tileCapActivo: {
        color: "#185FA5",
    },
});