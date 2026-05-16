import { useState } from 'react';
import { FlatList, Pressable, Switch, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchAdminMessages } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function AdminMessagesScreen() {
  const { styles, c } = useStyles(makeStyles);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-messages', unreadOnly],
    queryFn: () => fetchAdminMessages({ unread_only: unreadOnly ? 1 : 0, per_page: 50 }),
  });

  const messages = data?.data || [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Admin</Text>
        <Text style={styles.title}>Boîte de réception</Text>

        <View style={styles.toggleRow}>
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small }}>Non lus uniquement</Text>
          <Switch value={unreadOnly} onValueChange={setUnreadOnly} trackColor={{ true: c.gold, false: c.line }} thumbColor={c.fg} />
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(m: any) => String(m.id)}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
        ListEmptyComponent={
          <Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>
            {isLoading ? 'Chargement…' : 'Aucun message.'}
          </Text>
        }
        renderItem={({ item }: { item: any }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/admin/messages/${item.id}` as any)}>
            <View style={[styles.dot, { backgroundColor: item.is_read ? c.fgDim : c.gold }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.name, !item.is_read && { fontWeight: '700' as const }]}>{item.name}</Text>
              <Text style={styles.subject} numberOfLines={1}>{item.subject || '—'}</Text>
              <Text style={styles.meta}>
                {item.source} · {item.created_at ? new Date(item.created_at).toLocaleDateString('fr-FR') : ''}
              </Text>
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
  toggleRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },

  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
  name: { color: c.fg, fontSize: fontSize.body, marginBottom: 2 },
  subject: { color: c.fgMuted, fontSize: fontSize.small },
  meta: { color: c.fgDim, fontSize: fontSize.caption, marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: 1 },
});
