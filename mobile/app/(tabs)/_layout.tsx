import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/constants/theme';
import { useAuthStore } from '@/src/store/auth';

export default function TabsLayout() {
  const c = useThemeColors();
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.goldText,
        tabBarInactiveTintColor: c.fgDim,
        tabBarStyle: {
          backgroundColor: c.inkSoft,
          borderTopColor: c.line,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          letterSpacing: 1.4,
          textTransform: 'uppercase',
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portfolio',
          tabBarIcon: ({ color }) => <Ionicons name="images-outline" size={22} color={color} />,
        }}
      />
      {/* Admin ne demande pas de devis, il les gère */}
      <Tabs.Screen
        name="devis"
        options={{
          title: 'Devis',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={22} color={color} />,
          href: isAdmin ? null : '/(tabs)/devis',  // null = caché de la barre
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => <Ionicons name="briefcase-outline" size={22} color={color} />,
          href: isAdmin ? '/(tabs)/admin' : null,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: isAdmin ? 'Compte' : 'Compte',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
