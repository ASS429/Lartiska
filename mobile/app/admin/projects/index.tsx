import { useState } from 'react';
import { Alert, FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchAdminProjects,
  updateAdminProject,
  deleteAdminProject,
} from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const FILTERS = [
  { value: '', label: 'Tous' },
  { value: 'published', label: 'Publiés' },
  { value: 'draft', label: 'Brouillons' },
];

export default function AdminProjectsScreen() {
  const { styles, c } = useStyles(makeStyles);
  const qc = useQueryClient();
  const [status, setStatus] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects', status],
    queryFn: () => fetchAdminProjects({ status, per_page: 100 }),
  });

  const projects = data?.data || [];

  const togglePublish = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateAdminProject(id, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, featured }: { id: number; featured: boolean }) => updateAdminProject(id, { featured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteAdminProject(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-projects'] }),
  });

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Portfolio</Text>
        <Text style={styles.title}>Réalisations</Text>
        <Text style={styles.lead}>{data?.meta?.total ?? '…'} projets · {projects.filter((p: any) => p.featured).length} en vedette</Text>

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
        data={projects}
        keyExtractor={(p: any) => String(p.id)}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        ListEmptyComponent={
          <Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>
            {isLoading ? 'Chargement…' : 'Aucune réalisation.'}
          </Text>
        }
        renderItem={({ item }: { item: any }) => (
          <View style={styles.card}>
            {item.cover_image && (
              <Image source={{ uri: item.cover_image }} style={styles.cover} />
            )}
            <View style={styles.cardBody}>
              <View style={{ flexDirection: 'row', gap: 6, marginBottom: 6 }}>
                <View style={[styles.badge, item.status === 'published' && { borderColor: c.accepted, backgroundColor: 'rgba(52,211,153,0.1)' }]}>
                  <Text style={[styles.badgeText, item.status === 'published' && { color: c.accepted }]}>{item.status === 'published' ? 'Publié' : 'Brouillon'}</Text>
                </View>
                {item.featured && (
                  <View style={[styles.badge, { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}>
                    <Text style={[styles.badgeText, { color: c.goldText }]}>★ Vedette</Text>
                  </View>
                )}
              </View>

              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.category?.name} · {item.city || '—'} · {item.images_count ?? 0} img
              </Text>

              <View style={styles.actions}>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => togglePublish.mutate({ id: item.id, status: item.status === 'published' ? 'draft' : 'published' })}
                >
                  <Text style={styles.actionText}>{item.status === 'published' ? 'Dépublier' : 'Publier'}</Text>
                </Pressable>
                <Pressable
                  style={[styles.actionBtn, item.featured && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
                  onPress={() => toggleFeatured.mutate({ id: item.id, featured: !item.featured })}
                >
                  <Text style={[styles.actionText, item.featured && { color: c.goldText }]}>★</Text>
                </Pressable>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => router.push(`/admin/projects/${item.id}` as any)}
                >
                  <Ionicons name="create-outline" size={16} color={c.fgMuted} />
                </Pressable>
                <Pressable
                  style={styles.actionBtn}
                  onPress={() => Alert.alert(
                    'Supprimer ce projet ?',
                    `« ${item.title} » sera définitivement supprimé.`,
                    [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Supprimer', style: 'destructive', onPress: () => remove.mutate(item.id) },
                    ]
                  )}
                >
                  <Ionicons name="trash-outline" size={16} color={c.rejected} />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: c.line },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },
  lead: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 2, marginBottom: spacing.md },

  filters: { flexDirection: 'row' as const },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
  pillText: { color: c.fgMuted, fontSize: 12, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '500' as const },

  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, overflow: 'hidden' as const, marginBottom: spacing.md },
  cover: { width: '100%' as const, height: 160 },
  cardBody: { padding: spacing.md },

  badge: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { color: c.fgMuted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, lineHeight: 22 },
  cardMeta: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 4 },

  actions: { flexDirection: 'row' as const, gap: 6, marginTop: spacing.sm, flexWrap: 'wrap' as const },
  actionBtn: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.pill, flexDirection: 'row' as const, alignItems: 'center' as const },
  actionText: { color: c.fgMuted, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: '600' as const },
});
