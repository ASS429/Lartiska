import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchAdminTestimonials,
  fetchAdminProjects,
  createAdminTestimonial,
  updateAdminTestimonial,
  deleteAdminTestimonial,
} from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const EMPTY = {
  client_name: '',
  client_role: '',
  city: '',
  project_id: 0,
  content: '',
  rating: 5,
  is_published: true,
};

export default function AdminTestimonialsScreen() {
  const { styles, c } = useStyles(makeStyles);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<null | number | 'new'>(null);
  const [form, setForm] = useState<any>(EMPTY);

  const { data } = useQuery({ queryKey: ['admin-testimonials'], queryFn: () => fetchAdminTestimonials({ per_page: 100 }) });
  const { data: projects } = useQuery({ queryKey: ['admin-projects-light'], queryFn: () => fetchAdminProjects({ per_page: 100 }) });

  const items = data?.data || [];
  const projectsList = projects?.data || [];

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        project_id: form.project_id || null,
        rating: form.rating || null,
      };
      return editing === 'new' ? createAdminTestimonial(payload) : updateAdminTestimonial(editing!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-testimonials'] });
      setEditing(null);
      setForm(EMPTY);
    },
    onError: () => Alert.alert('Erreur'),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteAdminTestimonial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  const startEdit = (t: any) => {
    setEditing(t.id);
    setForm({
      client_name: t.client_name || '',
      client_role: t.client_role || '',
      city: t.city || '',
      project_id: t.project?.id || 0,
      content: t.content || '',
      rating: t.rating || 5,
      is_published: !!t.is_published,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>— Avis clients</Text>
            <Text style={styles.title}>Témoignages</Text>
          </View>
          <Pressable style={styles.btnGoldSm} onPress={() => { setEditing('new'); setForm(EMPTY); }}>
            <Text style={styles.btnGoldSmText}>+ Nouveau</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(t: any) => String(t.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>Aucun avis.</Text>}
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.card, !item.is_published && { opacity: 0.55 }]}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={styles.cardName}>{item.client_name}</Text>
                {item.rating && <Text style={styles.rating}>{'★'.repeat(item.rating)}</Text>}
              </View>
              <Text style={styles.cardMeta}>{[item.client_role, item.city].filter(Boolean).join(' · ')}</Text>
              <Text style={styles.cardContent} numberOfLines={3}>« {item.content} »</Text>
              {item.project && <Text style={styles.cardProject}>Projet : {item.project.title}</Text>}
            </View>
            <View style={{ gap: 6 }}>
              <Pressable style={styles.iconBtn} onPress={() => startEdit(item)}>
                <Ionicons name="create-outline" size={16} color={c.fgMuted} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={() => Alert.alert('Supprimer ?', `Avis de ${item.client_name}`, [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Supprimer', style: 'destructive', onPress: () => remove.mutate(item.id) },
                ])}
              >
                <Ionicons name="trash-outline" size={16} color={c.rejected} />
              </Pressable>
            </View>
          </View>
        )}
      />

      <Modal visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
        <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: 60 }}>
          <View style={styles.modalHead}>
            <Text style={styles.title}>{editing === 'new' ? 'Nouvel avis' : 'Éditer l\'avis'}</Text>
            <Pressable onPress={() => setEditing(null)} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={c.fg} />
            </Pressable>
          </View>

          <Text style={styles.label}>Nom du client</Text>
          <TextInput value={form.client_name} onChangeText={(v) => setForm({ ...form, client_name: v })} style={styles.input} />

          <Text style={styles.label}>Rôle (fonction)</Text>
          <TextInput value={form.client_role} onChangeText={(v) => setForm({ ...form, client_role: v })} style={styles.input} placeholder="Maître d'ouvrage…" placeholderTextColor={c.fgDim} />

          <Text style={styles.label}>Ville</Text>
          <TextInput value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} style={styles.input} />

          <Text style={styles.label}>Projet associé (optionnel)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.sm }}>
            <Pressable
              onPress={() => setForm({ ...form, project_id: 0 })}
              style={[styles.pill, !form.project_id && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
            >
              <Text style={[styles.pillText, !form.project_id && { color: c.goldText, fontWeight: '600' }]}>Aucun</Text>
            </Pressable>
            {projectsList.map((p: any) => (
              <Pressable
                key={p.id}
                onPress={() => setForm({ ...form, project_id: p.id })}
                style={[styles.pill, form.project_id === p.id && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
              >
                <Text style={[styles.pillText, form.project_id === p.id && { color: c.goldText, fontWeight: '600' }]} numberOfLines={1}>{p.title}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.label}>Témoignage</Text>
          <TextInput
            value={form.content}
            onChangeText={(v) => setForm({ ...form, content: v })}
            multiline
            numberOfLines={5}
            style={[styles.input, { minHeight: 120, textAlignVertical: 'top' }]}
          />

          <Text style={styles.label}>Note</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: spacing.md }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable key={n} onPress={() => setForm({ ...form, rating: n })}>
                <Ionicons name={form.rating >= n ? 'star' : 'star-outline'} size={28} color={c.gold} />
              </Pressable>
            ))}
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Publié sur le site</Text>
            <Switch value={form.is_published} onValueChange={(v) => setForm({ ...form, is_published: v })} trackColor={{ true: c.gold, false: c.line }} thumbColor={c.fg} />
          </View>

          <Pressable style={[styles.btnGold, { marginTop: spacing.lg }]} onPress={() => save.mutate()} disabled={save.isPending}>
            <Text style={styles.btnGoldText}>{save.isPending ? 'Enregistrement…' : 'Enregistrer'}</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md, borderBottomWidth: 1, borderBottomColor: c.line },
  headerRow: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-end' as const },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },

  btnGoldSm: { backgroundColor: c.gold, paddingHorizontal: spacing.md, paddingVertical: 9, borderRadius: radius.pill },
  btnGoldSmText: { color: c.ink, fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },

  list: { padding: spacing.lg, paddingBottom: spacing.xxl },
  card: { flexDirection: 'row' as const, backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  cardName: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg },
  rating: { color: c.goldText, fontSize: fontSize.small, letterSpacing: 2 },
  cardMeta: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 2 },
  cardContent: { color: c.fg, fontSize: fontSize.small, fontStyle: 'italic' as const, lineHeight: 22, marginTop: 6 },
  cardProject: { color: c.fgDim, fontSize: 11, marginTop: 6 },

  iconBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 1, borderColor: c.line },

  modalHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: spacing.md },
  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body, marginBottom: spacing.sm },
  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: spacing.sm },

  pill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs, maxWidth: 200 },
  pillText: { color: c.fgMuted, fontSize: 12 },
});
