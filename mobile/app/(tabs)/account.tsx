import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyQuotes } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { useThemeStore } from '@/src/store/theme';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function AccountScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { user, status, logout } = useAuthStore();
  const themeMode = useThemeStore((s) => s.mode);
  const setThemeMode = useThemeStore((s) => s.setMode);

  const isAdmin = user?.role === 'admin';

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: fetchMyQuotes,
    enabled: status === 'authenticated' && !isAdmin,
  });

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: c.pending },
    processing: { label: 'En cours d\'étude', color: c.processing },
    sent: { label: 'Devis envoyé', color: c.sent },
    accepted: { label: 'Accepté', color: c.accepted },
    rejected: { label: 'Refusé', color: c.rejected },
  };

  // Pas connecté
  if (status !== 'authenticated' || !user) {
    return (
      <ScrollView contentContainerStyle={[styles.screenScroll, styles.centerContent]}>
        <Text style={styles.eyebrowDeco}>✦ Mon espace</Text>
        <Text style={[styles.title, { textAlign: 'center', marginTop: spacing.md }]}>
          Suivez vos demandes
        </Text>
        <Text style={styles.lead}>
          Créez un compte pour retrouver vos devis, télécharger vos PDF et accepter en un tap.
        </Text>
        <Pressable style={styles.btnGold} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnGoldText}>Se connecter</Text>
        </Pressable>
        <Pressable style={[styles.btnGhost, { marginTop: spacing.sm }]} onPress={() => router.push('/auth/register')}>
          <Text style={styles.btnGhostText}>Créer un compte →</Text>
        </Pressable>

        <ThemeToggle mode={themeMode} setMode={setThemeMode} c={c} />
      </ScrollView>
    );
  }

  // ─── ADMIN ──────────────────────────────────────────────────
  if (isAdmin) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingTop: 60, paddingBottom: 40 }}>
        <Text style={styles.eyebrow}>— Mon compte</Text>
        <Text style={styles.title}>Bonjour {user.name?.split(' ')[0]}</Text>
        <Text style={styles.emailSmall}>{user.email}</Text>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark-outline" size={12} color={c.goldText} />
          <Text style={styles.adminBadgeText}>Administrateur</Text>
        </View>

        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={styles.cardTitle}>Espace admin</Text>
          <Text style={styles.cardLead}>Dashboard, devis, messages, portfolio, services, avis, réglages.</Text>
          <Pressable style={[styles.btnGold, { marginTop: spacing.md }]} onPress={() => router.push('/(tabs)/admin')}>
            <Ionicons name="briefcase-outline" size={18} color={c.ink} />
            <Text style={styles.btnGoldText}>Accéder à l'admin</Text>
          </Pressable>
        </View>

        <ThemeToggle mode={themeMode} setMode={setThemeMode} c={c} />

        <Pressable style={[styles.btnGhost, { marginTop: spacing.lg }]} onPress={logout}>
          <Text style={styles.btnGhostText}>Déconnexion</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ─── CLIENT ─────────────────────────────────────────────────
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Mon espace</Text>
        <Text style={styles.title}>Bonjour {user.name?.split(' ')[0]}</Text>
        <Text style={styles.emailSmall}>{user.email}</Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap' }}>
          <Pressable style={styles.btnGoldSmall} onPress={() => router.push('/(tabs)/devis')}>
            <Text style={styles.btnGoldSmallText}>+ Nouvelle demande</Text>
          </Pressable>
          <Pressable style={styles.btnGhostSmall} onPress={logout}>
            <Text style={styles.btnGhostSmallText}>Déconnexion</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(q) => String(q.id)}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.listHeader}>Mes demandes de devis</Text>
        }
        ListFooterComponent={<ThemeToggle mode={themeMode} setMode={setThemeMode} c={c} />}
        ListEmptyComponent={
          <View style={{ padding: spacing.xl, alignItems: 'center' }}>
            <Text style={{ color: c.fgMuted, fontFamily: 'serif', fontSize: fontSize.lg }}>
              Aucune demande pour l'instant
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const s = STATUS_LABELS[item.status] || { label: item.status, color: c.fgDim };
          return (
            <Pressable
              style={styles.quoteCard}
              onPress={() => router.push(`/quote/${item.id}`)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.quoteRef}>{item.reference}</Text>
                <Text style={styles.quoteTitle}>{item.service?.title || 'Demande générale'}</Text>
                <Text style={styles.quoteDate}>
                  {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : ''}
                  {item.has_pdf ? '  ·  PDF' : ''}
                </Text>
              </View>
              <View style={[styles.statusBadge, { borderColor: s.color }]}>
                <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
              </View>
            </Pressable>
          );
        }}
        refreshing={isLoading}
      />
    </View>
  );
}

function ThemeToggle({ mode, setMode, c }: { mode: 'light' | 'dark' | 'system'; setMode: (m: 'light' | 'dark' | 'system') => void; c: ThemeColors }) {
  const opts: { value: 'system' | 'light' | 'dark'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { value: 'light', label: 'Clair', icon: 'sunny-outline' },
    { value: 'system', label: 'Système', icon: 'phone-portrait-outline' },
    { value: 'dark', label: 'Sombre', icon: 'moon-outline' },
  ];

  return (
    <View style={{
      marginTop: spacing.xl,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: c.line,
      backgroundColor: c.surface,
    }}>
      <Text style={{ color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '700', marginBottom: spacing.sm }}>
        Apparence
      </Text>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {opts.map((o) => {
          const active = mode === o.value;
          return (
            <Pressable
              key={o.value}
              onPress={() => setMode(o.value)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: radius.sm,
                borderWidth: 1,
                borderColor: active ? c.gold : c.line,
                backgroundColor: active ? 'rgba(212,175,55,0.12)' : 'transparent',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ionicons name={o.icon} size={18} color={active ? c.goldText : c.fgMuted} />
              <Text style={{
                color: active ? c.goldText : c.fgMuted,
                fontSize: 11,
                fontWeight: '600',
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}>
                {o.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  screenScroll: { flexGrow: 1, backgroundColor: c.bg },
  centerContent: { paddingHorizontal: spacing.xl, paddingTop: 80, justifyContent: 'center' as const, flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: c.line },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '700' as const },
  eyebrowDeco: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, textAlign: 'center' as const, fontWeight: '700' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300' as const, marginTop: spacing.xs },
  emailSmall: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 2 },
  lead: { color: c.fgMuted, fontSize: fontSize.body, lineHeight: 24, textAlign: 'center' as const, marginVertical: spacing.lg },

  adminBadge: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 4, marginTop: spacing.sm, alignSelf: 'flex-start' as const, paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.pill, borderWidth: 1, borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.08)' },
  adminBadgeText: { color: c.goldText, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontWeight: '700' as const },

  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg },
  cardLead: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 6, lineHeight: 22 },

  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  listHeader: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xl, marginBottom: spacing.md },
  quoteCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  quoteRef: { color: c.goldText, fontSize: fontSize.caption, fontFamily: 'monospace', fontWeight: '700' as const },
  quoteTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginTop: 2 },
  quoteDate: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 4 },
  statusBadge: { borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  statusText: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '700' as const },

  btnGold: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: spacing.xs, backgroundColor: c.gold, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.pill },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '700' as const },
  btnGoldSmall: { backgroundColor: c.gold, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.pill },
  btnGoldSmallText: { color: c.ink, fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  btnGhost: { borderWidth: 1, borderColor: c.line, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGhostText: { color: c.fg, fontSize: fontSize.body },
  btnGhostSmall: { borderWidth: 1, borderColor: c.line, paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radius.pill },
  btnGhostSmallText: { color: c.fgMuted, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },
});
