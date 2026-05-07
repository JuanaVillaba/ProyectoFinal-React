import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TABS: {
  name: string;
  title: string;
  icon: IoniconsName;
  iconActive: IoniconsName;
}[] = [
  { name: 'index',      title: 'Inicio',      icon: 'home-outline',          iconActive: 'home'           },
  { name: 'incidencia', title: 'Incidentes',  icon: 'warning-outline',       iconActive: 'warning'        },
  { name: 'avisos',     title: 'Avisos',      icon: 'megaphone-outline',     iconActive: 'megaphone'      },
  { name: 'servicios',  title: 'Servicios',   icon: 'flash-outline',         iconActive: 'flash'          },
  { name: 'perfil',     title: 'Perfil',      icon: 'person-circle-outline', iconActive: 'person-circle'  },
];

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