import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchMyQuotes } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente', color: colors.pending },
  processing: { label: 'En cours d\'étude', color: colors.processing },
  sent: { label: 'Devis envoyé', color: colors.sent },
  accepted: { label: 'Accepté', color: colors.accepted },
  rejected: { label: 'Refusé', color: colors.rejected },
};

export default function AccountScreen() {
  const { user, status, logout } = useAuthStore();

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
            <Text style={{ color: colors.fgMuted, fontFamily: 'serif', fontSize: fontSize.lg }}>
              Aucune demande pour l'instant
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const status = STATUS_LABELS[item.status] || { label: item.status, color: colors.fgDim };
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
              <View style={[styles.statusBadge, { borderColor: status.color }]}>
                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
              </View>
            </Pressable>
          );
        }}
        refreshing={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  centerContent: { paddingHorizontal: spacing.xl, justifyContent: 'center' },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.line },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  eyebrowDeco: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300', marginTop: spacing.xs },
  emailSmall: { color: colors.fgMuted, fontSize: fontSize.small, marginTop: 2 },
  lead: { color: colors.fgMuted, fontSize: fontSize.body, lineHeight: 22, textAlign: 'center', marginVertical: spacing.lg },
  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  listHeader: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.xl, marginBottom: spacing.md },
  quoteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  quoteRef: { color: colors.gold, fontSize: fontSize.caption, fontFamily: 'monospace' },
  quoteTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginTop: 2 },
  quoteDate: { color: colors.fgMuted, fontSize: fontSize.caption, marginTop: 4 },
  statusBadge: { borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  statusText: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },

  btnGold: { backgroundColor: colors.gold, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600' },
  btnGoldSmall: { backgroundColor: colors.gold, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill },
  btnGoldSmallText: { color: colors.ink, fontSize: 11, fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  btnGhost: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.xl, paddingVertical: 12, borderRadius: radius.pill, alignItems: 'center' },
  btnGhostText: { color: colors.fg, fontSize: fontSize.body },
  btnGhostSmall: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill },
  btnGhostSmallText: { color: colors.fgMuted, fontSize: 11, letterSpacing: 0.5, textTransform: 'uppercase' },
});
