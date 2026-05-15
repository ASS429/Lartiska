import { FlatList, Pressable, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchMyQuotes } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function AccountScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { user, status, logout } = useAuthStore();

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    pending: { label: 'En attente', color: c.pending },
    processing: { label: 'En cours d\'étude', color: c.processing },
    sent: { label: 'Devis envoyé', color: c.sent },
    accepted: { label: 'Accepté', color: c.accepted },
    rejected: { label: 'Refusé', color: c.rejected },
  };

  const { data: quotes = [], isLoading } = useQuery({
    queryKey: ['my-quotes'],
    queryFn: fetchMyQuotes,
    enabled: status === 'authenticated',
  });

  // Pas connecté → CTA login/register
  if (status !== 'authenticated' || !user) {
    return (
      <View style={[styles.screen, styles.centerContent]}>
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
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Mon espace</Text>
        <Text style={styles.title}>Bonjour {user.name?.split(' ')[0]}</Text>
        <Text style={styles.emailSmall}>{user.email}</Text>

        <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md }}>
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

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  centerContent: { paddingHorizontal: spacing.xl, justifyContent: 'center' as const },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: c.line },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  eyebrowDeco: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, textAlign: 'center' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300' as const, marginTop: spacing.xs },
  emailSmall: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 2 },
  lead: { color: c.fgMuted, fontSize: fontSize.body, lineHeight: 24, textAlign: 'center' as const, marginVertical: spacing.lg },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  listHeader: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xl, marginBottom: spacing.md },
  quoteCard: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  quoteRef: { color: c.goldText, fontSize: fontSize.caption, fontFamily: 'monospace', fontWeight: '600' as const },
  quoteTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginTop: 2 },
  quoteDate: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 4 },
  statusBadge: { borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  statusText: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  btnGold: { backgroundColor: c.gold, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },
  btnGoldSmall: { backgroundColor: c.gold, paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.pill },
  btnGoldSmallText: { color: c.ink, fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  btnGhost: { borderWidth: 1, borderColor: c.line, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGhostText: { color: c.fg, fontSize: fontSize.body },
  btnGhostSmall: { borderWidth: 1, borderColor: c.line, paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.pill },
  btnGhostSmallText: { color: c.fgMuted, fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' as const, fontWeight: '500' as const },
});
