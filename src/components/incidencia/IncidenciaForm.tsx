// components/incidencia/IncidenciaForm.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView,
  Pressable, Animated, KeyboardAvoidingView,
  Platform, ActivityIndicator, Image, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  NuevaIncidencia, PrioridadIncidencia,
  COLORS, PRIORIDAD_META, SERVICIOS,
} from '@/features/incidencias/incidencia.store';
import { supabase } from "@/supabase/supabase";


type Props = {
  onSubmit: (data: NuevaIncidencia) => void;
  onCancel?: () => void;
  loading?: boolean;
};
type FormErrors = Partial<Record<keyof NuevaIncidencia, string>>;

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <View style={lbl.row}>
      <Text style={lbl.text}>{text}</Text>
      {required && <Text style={lbl.req}>*</Text>}
    </View>
  );
}
const lbl = StyleSheet.create({
  row: { flexDirection: 'row', gap: 3, alignItems: 'center', marginBottom: 8 },
  text: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, letterSpacing: 0.8, textTransform: 'uppercase' },
  req: { fontSize: 12, color: COLORS.danger, fontWeight: '700' },
});

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <View style={err.row}>
      <Ionicons name="alert-circle-outline" size={13} color={COLORS.danger} />
      <Text style={err.text}>{msg}</Text>
    </View>
  );
}
const err = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  text: { fontSize: 12, color: COLORS.danger },
});

export default function IncidenciaForm({ onSubmit, onCancel, loading }: Props) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [servicio, setServicio] = useState('');
  const [prioridad, setPrioridad] = useState<PrioridadIncidencia>('media');
  const [imagen, setImagen] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const descRef = useRef<TextInput>(null);
  const btnScale = useRef(new Animated.Value(1)).current;

  // ── Image picker ────────────────────────────────────────────────────────────
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu galería para adjuntar fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });
    if (!result.canceled) setImagen(result.assets[0].uri);
  };

  // ── Validación ──────────────────────────────────────────────────────────────
  function validate(): FormErrors {
    const e: FormErrors = {};
    if (!titulo.trim()) e.titulo = 'El título es obligatorio';
    if (titulo.length > 80) e.titulo = 'Máximo 80 caracteres';
    if (!descripcion.trim()) e.descripcion = 'Describí el problema brevemente';
    if (!servicio) e.servicio = 'Seleccioná un servicio';
    return e;
  }

  function revalidate(field: keyof FormErrors, value: string) {
    if (!submitted) return;
    const e = { ...errors };
    if (field === 'titulo') {
      if (!value.trim()) e.titulo = 'El título es obligatorio';
      else if (value.length > 80) e.titulo = 'Máximo 80 caracteres';
      else delete e.titulo;
    }
    if (field === 'descripcion') {
      if (!value.trim()) e.descripcion = 'Describí el problema brevemente';
      else delete e.descripcion;
    }
    setErrors(e);
  }

  async function handleSubmit() {
    setSubmitted(true);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;
    Animated.sequence([
      Animated.timing(btnScale, { toValue: 0.94, duration: 80, useNativeDriver: false }),
      Animated.timing(btnScale, { toValue: 1, duration: 80, useNativeDriver: false }),
    ]).start();
    //onSubmit({ titulo: titulo.trim(), descripcion: descripcion.trim(), servicio, prioridad, imagen });
    try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user) {
          Alert.alert("Error", "Debes estar autenticado para reportar una incidencia");
          return;
        }
        const { data, error } = await supabase
          .from('incidents')
          .insert([{
            titulo: titulo.trim(),
            descripcion: descripcion.trim(),
            imagen: null,
            servicio: servicio,
            user_id: user.id,
            prioridad: prioridad,
            fecha: new Date().toISOString(),
            estado: 'pendiente',
          }])
          .select();
        if (error) console.log("Error:", error);
      
      Alert.alert("Incidencia reportada correctamente");
      onSubmit({ titulo, descripcion, servicio, prioridad, imagen });

    } catch (error: any) {
      Alert.alert("Error", error.message || "No se pudo guardar la incidencia");
    }
  }

  const prioridades: PrioridadIncidencia[] = ['baja', 'media', 'alta', 'critica'];


  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título */}
        <View style={styles.field}>
          <Label text="Título" required />
          <View style={[styles.inputWrap, errors.titulo && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="Ej: Pérdida de agua en pasillo"
              placeholderTextColor={COLORS.textMuted}
              value={titulo}
              onChangeText={(v) => { setTitulo(v); revalidate('titulo', v); }}
              returnKeyType="next"
              onSubmitEditing={() => descRef.current?.focus()}
              maxLength={90}
            />
            <Text style={styles.charCount}>{titulo.length}/80</Text>
          </View>
          <ErrorMsg msg={errors.titulo} />
        </View>

        {/* Servicio */}
        <View style={styles.field}>
          <Label text="Servicio afectado" required />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
            {SERVICIOS.map((s) => {
              const active = servicio === s;
              return (
                <Pressable
                  key={s}
                  onPress={() => { setServicio(s); if (submitted) setErrors((e) => { const n = { ...e }; delete n.servicio; return n; }); }}
                  style={[styles.chip, active && { backgroundColor: COLORS.accent, borderColor: COLORS.accent }]}
                >
                  <Text style={[styles.chipText, active && { color: '#fff' }]}>{s}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
          <ErrorMsg msg={errors.servicio} />
        </View>

        {/* Descripción */}
        <View style={styles.field}>
          <Label text="Descripción" required />
          <View style={[styles.inputWrap, styles.textareaWrap, errors.descripcion && styles.inputError]}>
            <TextInput
              ref={descRef}
              style={[styles.input, styles.textarea]}
              placeholder="Describí el problema con el mayor detalle posible..."
              placeholderTextColor={COLORS.textMuted}
              value={descripcion}
              onChangeText={(v) => { setDescripcion(v); revalidate('descripcion', v); }}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          <ErrorMsg msg={errors.descripcion} />
        </View>

        {/* Foto adjunta */}
        <View style={styles.field}>
          <Label text="Foto adjunta" />
          {imagen ? (
            <View style={styles.previewWrap}>
              <Image source={{ uri: imagen }} style={styles.preview} resizeMode="cover" />
              <Pressable style={styles.removeBtn} onPress={() => setImagen(null)}>
                <Ionicons name="close-circle" size={28} color={COLORS.danger} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.imgRow}>
              <Pressable style={styles.imgBtn} onPress={pickImage}>
                <Ionicons name="images-outline" size={22} color={COLORS.accent} />
                <Text style={styles.imgBtnText}>Galería</Text>
              </Pressable>
              <Pressable style={styles.imgBtn} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={22} color={COLORS.accent} />
                <Text style={styles.imgBtnText}>Cámara</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Prioridad */}
        <View style={styles.field}>
          <Label text="Prioridad" />
          <View style={styles.prioGrid}>
            {prioridades.map((p) => {
              const meta = PRIORIDAD_META[p];
              const active = prioridad === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPrioridad(p)}
                  style={[styles.prioCard, active && { backgroundColor: meta.color + '12', borderColor: meta.color }]}
                >
                  <Ionicons name={meta.icon as any} size={18} color={active ? meta.color : COLORS.textMuted} />
                  <Text style={[styles.prioLabel, active && { color: meta.color, fontWeight: '700' }]}>
                    {meta.label}
                  </Text>
                  {active && (
                    <View style={[styles.prioCheck, { backgroundColor: meta.color }]}>
                      <Ionicons name="checkmark" size={9} color="#fff" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <Text style={styles.hint}>* Campos obligatorios</Text>
      </ScrollView>

      {/* Acciones */}
      <View style={styles.actions}>
        {onCancel && (
          <Pressable style={styles.btnCancel} onPress={onCancel}>
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </Pressable>
        )}
        <Animated.View style={[{ flex: 2 }, { transform: [{ scale: btnScale }] }]}>
          <Pressable
            style={[styles.btnSubmit, loading && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <><Ionicons name="paper-plane-outline" size={18} color="#fff" /><Text style={styles.btnSubmitText}>Reportar incidente</Text></>
            }
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: COLORS.bg },
  content: { padding: 20, gap: 22, paddingBottom: 16 },
  field: { gap: 0 },

  inputWrap: {
    backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14,
  },
  inputError: { borderColor: COLORS.danger },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary, paddingVertical: 13 },
  charCount: { fontSize: 11, color: COLORS.textMuted },
  textareaWrap: { alignItems: 'flex-start', paddingVertical: 10 },
  textarea: { minHeight: 110, paddingTop: 4 },

  chipsRow: { gap: 8, paddingVertical: 2 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border },
  chipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },

  // Imagen
  previewWrap: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  preview: { width: '100%', height: 200 },
  removeBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: '#fff', borderRadius: 14 },
  imgRow: { flexDirection: 'row', gap: 10 },
  imgBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: COLORS.surface, borderRadius: 14,
    borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed', paddingVertical: 18,
  },
  imgBtnText: { fontSize: 14, fontWeight: '600', color: COLORS.accent },

  // Prioridad
  prioGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  prioCard: {
    width: '47%', flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.surface, borderRadius: 12,
    borderWidth: 1.5, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 12, position: 'relative',
  },
  prioLabel: { fontSize: 13, color: COLORS.textMuted, fontWeight: '500' },
  prioCheck: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  hint: { fontSize: 11, color: COLORS.textMuted, marginTop: -8 },

  actions: {
    flexDirection: 'row', gap: 10, padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    backgroundColor: COLORS.bg, borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  btnCancel: { flex: 1, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  btnCancelText: { fontSize: 15, fontWeight: '600', color: COLORS.textSecondary },
  btnSubmit: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, backgroundColor: COLORS.accent },
  btnSubmitText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
