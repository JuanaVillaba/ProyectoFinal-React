import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ─── Definición de tabs ───────────────────────────────────────────────────────
const TABS = [
  {
    name:       'index',
    title:      'Inicio',
    icon:       'home-outline'       as const,
    iconActive: 'home'               as const,
  },
  {
    name:       'incidencia',
    title:      'Incidentes',
    icon:       'warning-outline'    as const,
    iconActive: 'warning'            as const,
  },
  {
    name:       'servicios',
    title:      'Servicios',
    icon:       'flash-outline'      as const,
    iconActive: 'flash'              as const,
  },
  {
    name:       'avisos',
    title:      'Avisos',
    icon:       'megaphone-outline'  as const,
    iconActive: 'megaphone'          as const,
  },
  {
    name:       'perfil',
    title:      'Perfil',
    icon:       'person-outline'     as const,
    iconActive: 'person'             as const,
  },
] satisfies { name: string; title: string; icon: React.ComponentProps<typeof Ionicons>['name']; iconActive: React.ComponentProps<typeof Ionicons>['name'] }[];

// ─── Layout ───────────────────────────────────────────────────────────────────
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => {
        const tab = TABS.find((t) => t.name === route.name);
        return {
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? (tab?.iconActive ?? 'home') : (tab?.icon ?? 'home-outline')}
              size={size}
              color={color}
            />
          ),
          tabBarActiveTintColor:   '#4338ca',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            borderTopWidth:  0.5,
            borderTopColor:  '#e5e7eb',
            paddingBottom:   6,
            paddingTop:      6,
            height:          60,
          },
          tabBarLabelStyle: {
            fontSize:   10,
            fontWeight: '600',
          },
        };
      }}
    >
      {/* Tabs visibles */}
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}

      {/* Pantallas que NO deben aparecer en la tab bar */}
      <Tabs.Screen name="incidentes" options={{ href: null }} />
    </Tabs>
  );
}
