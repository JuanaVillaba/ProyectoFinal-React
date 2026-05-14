import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ActivityIndicator, Avatar, Button, ProgressBar, Text, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import Screen from '@/components/ui/Screen';
import { supabase } from '@/lib/supabase';


// ─── Tipos ────────────────────────────────────────────────────────────────────


type Profile = {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  avatar_url: string | null;
  is_active: boolean;
};


type Home = {
  id: string;
  floor: string | null;
  unit: string | null;
};


// ─── Constantes ───────────────────────────────────────────────────────────────


const ROLE_LABELS: Record<string, string> = {
  owner:    'Propietario',
  admin:    'Administrador',
  resident: 'Residente',
  guest:    'Invitado',
};


const ROLE_ICONS: Record<string, string> = {
  owner:    'home-account',
  admin:    'shield-crown',
  resident: 'account-home',
  guest:    'account-clock',
};


const ROLE_COLORS: Record<string, string> = {
  owner:    '#7C3AED',
  admin:    '#2563EB',
  resident: '#059669',
  guest:    '#D97706',
};


// ─── Helpers ──────────────────────────────────────────────────────────────────


const iniciales = (name: string) =>
  name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase() || '?';


function calcularCompletitud(profile: Profile | null, home: Home | null, email: string): number {
  if (!profile) return 0;
  const campos = [
    !!profile.name?.trim(),
    !!profile.phone?.trim(),
    !!email,
    !!profile.role,
    !!home?.floor?.trim(),
    !!home?.unit?.trim(),
  ];
  return campos.filter(Boolean).length / campos.length;
}


function hintCompletitud(profile: Profile | null, home: Home | null): string {
  const faltantes: string[] = [];
  if (!profile?.phone?.trim()) faltantes.push('teléfono');
  if (!home?.floor?.trim())    faltantes.push('piso');
  if (!home?.unit?.trim())     faltantes.push('departamento');
  if (faltantes.length === 0)  return '';
  return `Falta: ${faltantes.join(', ')}`;
}


// ─── Componente principal ─────────────────────────────────────────────────────


export default function PerfilScreen() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();


  // Estado
  const [profile,   setProfile]   = useState<Profile | null>(null);
  const [home,      setHome]      = useState<Home | null>(null);
  const [cargando,  setCargando]  = useState(true);
  const [editando,  setEditando]  = useState(false);
  const [guardando, setGuardando] = useState(false);


  // Campos del formulario
  const [nombre,   setNombre]   = useState('');
  const [telefono, setTelefono] = useState('');
  const [piso,     setPiso]     = useState('');
  const [unidad,   setUnidad]   = useState('');


  // Animaciones
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;


  const userId = session?.user?.id ?? '';
  const email  = session?.user?.email ?? '';


  const completitud    = calcularCompletitud(profile, home, email);
  const perfilCompleto = completitud >= 1;


  const roleKey   = profile?.role ?? '';
  const roleColor = ROLE_COLORS[roleKey] ?? '#7C3AED';
  const roleIcon  = (ROLE_ICONS[roleKey] ?? 'account') as any;
  const roleLabel = ROLE_LABELS[roleKey] ?? roleKey ?? 'Sin rol';
  const nombreMostrado = profile?.name?.trim() || 'Sin nombre';


  // ── Animación de entrada ──────────────────────────────────────────────────
  useEffect(() => {
    if (!cargando) {
      Animated.parallel([
        Animated.timing(fadeAnim,  { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
  }, [cargando]);


  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (userId) cargarDatos();
  }, [userId]);


  const cargarDatos = async () => {
    setCargando(true);


    // Cargar perfil
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, name, role, phone, avatar_url, is_active')
      .eq('user_id', userId)
      .maybeSingle();


    if (profileError) {
      console.error('Error cargando perfil:', profileError.message);
      setCargando(false);
      return;
    }


    let perfil = profileData;


    // Crear perfil si no existe
    if (!perfil) {
      const nombreAuth =
        session?.user?.user_metadata?.full_name ||
        session?.user?.user_metadata?.name ||
        email.split('@')[0] || '';


      const { data: nuevo, error: errInsert } = await supabase
        .from('profiles')
        .insert({ id: userId, user_id: userId, name: nombreAuth, role: 'resident', is_active: true })
        .select('id, name, role, phone, avatar_url, is_active')
        .maybeSingle();


      if (errInsert) {
        console.error('Error creando perfil:', errInsert.message);
        setCargando(false);
        return;
      }
      perfil = nuevo;
    }


    if (perfil) {
      setProfile(perfil);
      setNombre(perfil.name ?? '');
      setTelefono(perfil.phone ?? '');
    }


    // Cargar home
    const { data: homeData } = await supabase
      .from('homes')
      .select('id, floor, unit')
      .eq('owner_id', userId)
      .maybeSingle();


    if (homeData) {
      setHome(homeData);
      setPiso(homeData.floor ?? '');
      setUnidad(homeData.unit ?? '');
    }


    setCargando(false);
  };


  // ── Guardar ───────────────────────────────────────────────────────────────
  const guardarCambios = async () => {
    if (!nombre.trim()) {
      Alert.alert('Campo requerido', 'El nombre no puede estar vacío.');
      return;
    }


    setGuardando(true);


    // Actualizar profile
    const { error: errProfile } = await supabase
      .from('profiles')
      .update({ name: nombre.trim(), phone: telefono.trim() || null, updated_at: new Date().toISOString() })
      .eq('user_id', userId);


    if (errProfile) {
      setGuardando(false);
      Alert.alert('Error', 'No se pudieron guardar los cambios.');
      return;
    }


    // Actualizar o crear home
    if (home?.id) {
      await supabase
        .from('homes')
        .update({ floor: piso.trim() || null, unit: unidad.trim() || null })
        .eq('id', home.id);
    } else if (piso.trim() || unidad.trim()) {
      const { data: newHome } = await supabase
        .from('homes')
        .insert({ owner_id: userId, floor: piso.trim() || null, unit: unidad.trim() || null })
        .select('id, floor, unit')
        .maybeSingle();
      if (newHome) setHome(newHome);
    }


    // Refrescar estado local
    setProfile((p) => p ? { ...p, name: nombre.trim(), phone: telefono.trim() || null } : p);
    setHome((h) =>
      h  ? { ...h, floor: piso.trim() || null, unit: unidad.trim() || null }
         : { id: home?.id ?? '', floor: piso.trim() || null, unit: unidad.trim() || null }
    );


    setGuardando(false);
    setEditando(false);
  };


  const cancelarEdicion = () => {
    setNombre(profile?.name ?? '');
    setTelefono(profile?.phone ?? '');
    setPiso(home?.floor ?? '');
    setUnidad(home?.unit ?? '');
    setEditando(false);
  };


  const cerrarSesion = async () => {
  Alert.alert(
    'Cerrar sesión',
    '¿Estás seguro de que querés salir?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Salir',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();

            if (error) {
              Alert.alert('Error', error.message);
              return;
            }

            router.replace('/');

          } catch (err: any) {
            Alert.alert(
              'Error',
              err?.message || 'No se pudo cerrar sesión'
            );
          }
        },
      },
    ]
  );
};

  // ── Loading ───────────────────────────────────────────────────────────────
  if (cargando) {
    return (
      <Screen>
        <View style={s.centro}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={s.cargandoTexto}>Cargando tu perfil...</Text>
        </View>
      </Screen>
    );
  }


  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>


            {/* ── Banner completación ── */}
            {!perfilCompleto && !editando && (
              <View style={s.banner}>
                <View style={s.bannerIcono}>
                  <MaterialCommunityIcons name="account-edit" size={20} color="#7C3AED" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.bannerTitulo}>Completá tu perfil</Text>
                  <Text style={s.bannerDesc}>{hintCompletitud(profile, home)}</Text>
                </View>
                <TouchableOpacity onPress={() => setEditando(true)} style={s.bannerBtn} activeOpacity={0.8}>
                  <Text style={s.bannerBtnTexto}>Completar</Text>
                </TouchableOpacity>
              </View>
            )}


            {/* ── Avatar / cabecera ── */}
            <View style={s.cabecera}>
              <View style={s.avatarWrap}>
                <Avatar.Text
                  size={88}
                  label={iniciales(nombreMostrado)}
                  style={[s.avatar, { backgroundColor: roleColor }]}
                  labelStyle={{ fontSize: 30, fontWeight: '800', color: '#fff' }}
                />
                <View style={[s.rolBadge, { backgroundColor: roleColor }]}>
                  <MaterialCommunityIcons name={roleIcon} size={13} color="#fff" />
                </View>
              </View>
              <Text style={s.nombre}>{nombreMostrado}</Text>
              <View style={[s.rolPill, { backgroundColor: roleColor + '18', borderColor: roleColor + '40' }]}>
                <MaterialCommunityIcons name={roleIcon} size={12} color={roleColor} style={{ marginRight: 5 }} />
                <Text style={[s.rolTexto, { color: roleColor }]}>{roleLabel}</Text>
              </View>
              <Text style={s.emailTexto}>{email}</Text>
            </View>


            {/* ── Barra de completitud ── */}
            <View style={s.completitudCard}>
              <View style={s.completitudRow}>
                <Text style={s.completitudLabel}>
                  {perfilCompleto ? '✓  Perfil completo' : 'Completitud del perfil'}
                </Text>
                <Text style={[s.completitudPct, { color: perfilCompleto ? '#059669' : '#7C3AED' }]}>
                  {Math.round(completitud * 100)}%
                </Text>
              </View>
              <ProgressBar
                progress={completitud}
                color={perfilCompleto ? '#059669' : '#7C3AED'}
                style={s.progressBar}
              />
              {!perfilCompleto && (
                <Text style={s.completitudHint}>{hintCompletitud(profile, home)}</Text>
              )}
            </View>


            {/* ── Tarjeta de información ── */}
            <View style={s.card}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitulo}>Información personal</Text>
                {!editando && (
                  <TouchableOpacity onPress={() => setEditando(true)} style={s.editarBtn} activeOpacity={0.7}>
                    <MaterialCommunityIcons name="pencil-outline" size={14} color="#7C3AED" />
                    <Text style={s.editarBtnTexto}>Editar</Text>
                  </TouchableOpacity>
                )}
              </View>


              <View style={s.separador} />


              {editando ? (
                /* ─── Formulario de edición ─── */
                <View style={s.edicion}>
                  <Text style={s.edicionHint}>Editá los campos que querés actualizar</Text>


                  <Text style={s.seccionLabel}>DATOS PERSONALES</Text>


                  <TextInput
                    label="Nombre completo *"
                    value={nombre}
                    onChangeText={setNombre}
                    mode="outlined"
                    style={s.input}
                    outlineColor="#E2E8F0"
                    activeOutlineColor="#7C3AED"
                    theme={{ roundness: 12 }}
                    left={<TextInput.Icon icon="account-outline" color="#7C3AED" />}
                    placeholder="Ej: Juan Pérez"
                  />


                  <TextInput
                    label="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={s.input}
                    outlineColor="#E2E8F0"
                    activeOutlineColor="#7C3AED"
                    theme={{ roundness: 12 }}
                    left={<TextInput.Icon icon="phone-outline" color="#7C3AED" />}
                    placeholder="Ej: +54 9 11 1234-5678"
                  />


                  <Text style={[s.seccionLabel, { marginTop: 4 }]}>UBICACIÓN EN EL EDIFICIO</Text>


                  <View style={s.filaInputs}>
                    <TextInput
                      label="Piso"
                      value={piso}
                      onChangeText={setPiso}
                      mode="outlined"
                      style={[s.input, s.inputMitad]}
                      outlineColor="#E2E8F0"
                      activeOutlineColor="#7C3AED"
                      theme={{ roundness: 12 }}
                      left={<TextInput.Icon icon="office-building-outline" color="#7C3AED" />}
                      placeholder="Ej: 3"
                    />
                    <TextInput
                      label="Departamento"
                      value={unidad}
                      onChangeText={setUnidad}
                      mode="outlined"
                      style={[s.input, s.inputMitad]}
                      outlineColor="#E2E8F0"
                      activeOutlineColor="#7C3AED"
                      theme={{ roundness: 12 }}
                      left={<TextInput.Icon icon="door" color="#7C3AED" />}
                      placeholder="Ej: B"
                    />
                  </View>


                  <View style={s.botonesEdicion}>
                    <Button
                      mode="outlined"
                      onPress={cancelarEdicion}
                      style={s.btnCancelar}
                      textColor="#718096"
                      disabled={guardando}
                    >
                      Cancelar
                    </Button>
                    <Button
                      mode="contained"
                      onPress={guardarCambios}
                      loading={guardando}
                      disabled={guardando}
                      style={s.btnGuardar}
                      buttonColor="#7C3AED"
                    >
                      Guardar cambios
                    </Button>
                  </View>
                </View>
              ) : (
                /* ─── Vista de solo lectura ─── */
                <View style={s.lectura}>
                  <FilaInfo icono="account-outline"         etiqueta="Nombre"       valor={profile?.name  || '—'} color="#7C3AED" />
                  <FilaInfo icono="phone-outline"           etiqueta="Teléfono"     valor={profile?.phone || '—'} color="#7C3AED" alerta={!profile?.phone} />
                  <FilaInfo icono="office-building-outline" etiqueta="Piso"         valor={home?.floor    || '—'} color="#7C3AED" alerta={!home?.floor} />
                  <FilaInfo icono="door"                    etiqueta="Departamento" valor={home?.unit     || '—'} color="#7C3AED" alerta={!home?.unit} />
                  <FilaInfo icono="email-outline"           etiqueta="Email"        valor={email}                 color="#7C3AED" />
                  <FilaInfo icono={roleIcon}                etiqueta="Rol"          valor={roleLabel}             color={roleColor} ultimo />
                </View>
              )}
            </View>


            {/* ── Cerrar sesión ── */}
            <TouchableOpacity onPress={cerrarSesion} style={s.btnSalir} activeOpacity={0.85} disabled={authLoading}>
              <MaterialCommunityIcons name="logout" size={17} color="#EF4444" />
              <Text style={s.btnSalirTexto}>
                {authLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
              </Text>
            </TouchableOpacity>


            <Text style={s.version}>v1.0.0 · Gestión Domiciliaria</Text>


          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}


// ─── Fila de lectura ──────────────────────────────────────────────────────────


function FilaInfo({
  icono, etiqueta, valor, color,
  alerta = false, ultimo = false,
}: {
  icono: string; etiqueta: string; valor: string;
  color: string; alerta?: boolean; ultimo?: boolean;
}) {
  return (
    <View style={[s.fila, ultimo && { borderBottomWidth: 0 }]}>
      <View style={[s.filaIcono, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icono as any} size={16} color={color} />
      </View>
      <View style={s.filaTextos}>
        <Text style={s.filaLabel}>{etiqueta}</Text>
        <Text style={[s.filaValor, alerta && s.filaAlerta]}>
          {alerta ? '⚠  Sin completar' : valor}
        </Text>
      </View>
    </View>
  );
}


// ─── Estilos ──────────────────────────────────────────────────────────────────


const s = StyleSheet.create({
  scroll:        { padding: 20, paddingBottom: 52 },
  centro:        { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  cargandoTexto: { color: '#718096', fontSize: 14 },


  // Banner
  banner:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F0FF', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#DDD6FE', gap: 10 },
  bannerIcono:   { width: 36, height: 36, borderRadius: 10, backgroundColor: '#EDE9FE', alignItems: 'center', justifyContent: 'center' },
  bannerTitulo:  { fontSize: 13, fontWeight: '700', color: '#4C1D95', marginBottom: 2 },
  bannerDesc:    { fontSize: 11.5, color: '#6D28D9', lineHeight: 16 },
  bannerBtn:     { backgroundColor: '#7C3AED', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 7 },
  bannerBtnTexto:{ color: '#fff', fontSize: 12, fontWeight: '700' },


  // Cabecera
  cabecera:  { alignItems: 'center', paddingVertical: 24, marginBottom: 4 },
  avatarWrap:{ position: 'relative', marginBottom: 14 },
  avatar:    { elevation: 4, shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10 },
  rolBadge:  { position: 'absolute', bottom: 2, right: 2, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: '#fff' },
  nombre:    { fontSize: 22, fontWeight: '800', color: '#1A202C', marginBottom: 8, textAlign: 'center', letterSpacing: -0.3 },
  rolPill:   { flexDirection: 'row', alignItems: 'center', borderRadius: 20, paddingHorizontal: 13, paddingVertical: 5, marginBottom: 8, borderWidth: 1 },
  rolTexto:  { fontSize: 12.5, fontWeight: '700' },
  emailTexto:{ color: '#718096', fontSize: 13.5 },


  // Completitud
  completitudCard:  { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F0EAFB', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  completitudRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  completitudLabel: { fontSize: 13, fontWeight: '600', color: '#2D3748' },
  completitudPct:   { fontSize: 14, fontWeight: '800' },
  progressBar:      { height: 7, borderRadius: 6, backgroundColor: '#EDE9FE' },
  completitudHint:  { marginTop: 7, fontSize: 11.5, color: '#A78BFA', fontWeight: '500' },


  // Card
  card:          { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#F0EAFB', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  cardTitulo:    { fontSize: 14.5, fontWeight: '700', color: '#1A202C', letterSpacing: -0.2 },
  editarBtn:     { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, backgroundColor: '#F5F0FF' },
  editarBtnTexto:{ color: '#7C3AED', fontSize: 13, fontWeight: '600' },
  separador:     { height: 1, backgroundColor: '#F0EAFB' },


  // Lectura
  lectura:   { paddingHorizontal: 16, paddingBottom: 4 },
  fila:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#F7F3FF', gap: 12 },
  filaIcono: { width: 34, height: 34, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  filaTextos:{ flex: 1 },
  filaLabel: { color: '#A0AEC0', fontSize: 10.5, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 },
  filaValor: { color: '#2D3748', fontSize: 14, fontWeight: '600' },
  filaAlerta:{ color: '#F59E0B', fontSize: 13, fontWeight: '600' },


  // Edición
  edicion:       { padding: 16 },
  edicionHint:   { fontSize: 13, color: '#718096', marginBottom: 16, lineHeight: 18 },
  seccionLabel:  { fontSize: 10.5, fontWeight: '700', color: '#A0AEC0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 },
  input:         { marginBottom: 12, backgroundColor: '#FAFAFA', fontSize: 14 },
  filaInputs:    { flexDirection: 'row', gap: 10 },
  inputMitad:    { flex: 1 },
  botonesEdicion:{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 6 },
  btnCancelar:   { borderColor: '#E2E8F0', borderRadius: 10 },
  btnGuardar:    { borderRadius: 10 },


  // Cerrar sesión
  btnSalir:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#FEE2E2', backgroundColor: '#FFF5F5' },
  btnSalirTexto:{ color: '#EF4444', fontSize: 14.5, fontWeight: '700' },
  version:      { textAlign: 'center', color: '#CBD5E0', fontSize: 11, marginTop: 20 },
});


