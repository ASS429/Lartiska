import { useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchAdminQuotes } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours' },
  { value: 'sent', label: 'Envoyés' },
  { value: 'accepted', label: 'Acceptés' },
  { value: 'rejected', label: 'Refusés' },
];

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

export default function AdminQuotesScreen() {
  const { styles, c } = useStyles(makeStyles);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-quotes', status, search],
    queryFn: () => fetchAdminQuotes({ status, search, per_page: 50 }),
  });

  const quotes = data?.data || [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Admin</Text>
        <Text style={styles.title}>Toutes les demandes</Text>

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Rechercher (référence, nom, email…)"
          placeholderTextColor={c.fgDim}
          style={styles.searchInput}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setStatus(f.value)}
              style={[styles.pill, status === f.value && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
            >
              <Text style={[styles.pillText, status === f.value && { color: c.goldText, fontWeight: '600' }]}>{f.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={quotes}
        keyExtractor={(q) => String(q.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>
            {isLoading ? 'Chargement…' : 'Aucun devis ne correspond.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/admin/quotes/${item.id}` as any)}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ref}>{item.reference}</Text>
              <Text style={styles.name}>{item.client_name}</Text>
              <Text style={styles.meta}>
                {item.service?.title || '—'}
                {item.created_at ? ` · ${new Date(item.created_at).toLocaleDateString('fr-FR')}` : ''}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{STATUS_LABELS[item.status] || item.status}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: c.line },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs, marginBottom: spacing.md },

  searchInput: { borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, color: c.fg, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: fontSize.body, marginBottom: spacing.sm },

  filters: { flexDirection: 'row' as const },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
  pillText: { color: c.fgMuted, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '500' as const },

  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: { flexDirection: 'row' as const, alignItems: 'center' as const, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  ref: { color: c.goldText, fontFamily: 'monospace', fontSize: 11, fontWeight: '600' as const },
  name: { color: c.fg, fontSize: fontSize.body, marginTop: 2 },
  meta: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 4 },

  badge: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  badgeText: { color: c.fgMuted, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '600' as const },
});
