import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
      <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="incidencia"
        options={{
          title: 'Incidencia',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning" size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen name="incidentes" options={{href: null, title:"incidentes"}}/>
      
      <Tabs.Screen
        name="servicios"
        options={{
          title: 'Servicios',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="flash" size={size} color={color} />
          ),
        }}
      />

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
          tabBarLabel: tab?.title ?? route.name,
          tabBarActiveTintColor: '#4338ca',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarStyle: {
            borderTopWidth: 0.5,
            borderTopColor: '#e5e7eb',
            paddingBottom: 6,
            paddingTop: 6,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
          },
        };
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen key={tab.name} name={tab.name} />
      ))}
    </Tabs>
  );
}