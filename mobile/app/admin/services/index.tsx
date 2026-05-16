import { useState } from 'react';
import { Alert, FlatList, Modal, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchAdminServices,
  fetchAdminCategories,
  createAdminService,
  updateAdminService,
  deleteAdminService,
} from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const UNITS = [
  { value: 'm2', label: 'au m²' },
  { value: 'forfait', label: 'forfait' },
  { value: 'jour', label: 'à la journée' },
  { value: 'piece', label: 'à la pièce' },
];

const EMPTY = {
  title: '',
  description: '',
  category_id: 0,
  price_from: '',
  price_to: '',
  unit: 'forfait',
  is_active: true,
};

export default function AdminServicesScreen() {
  const { styles, c } = useStyles(makeStyles);
  const qc = useQueryClient();
  const [editing, setEditing] = useState<null | number | 'new'>(null);
  const [form, setForm] = useState<any>(EMPTY);

  const { data } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => fetchAdminServices({ per_page: 100 }),
  });
  const { data: categories = [] } = useQuery({ queryKey: ['admin-categories'], queryFn: fetchAdminCategories });

  const services = data?.data || [];

  const save = useMutation({
    mutationFn: () => {
      const payload = {
        ...form,
        category_id: Number(form.category_id),
        price_from: form.price_from === '' ? null : Number(form.price_from),
        price_to: form.price_to === '' ? null : Number(form.price_to),
      };
      return editing === 'new' ? createAdminService(payload) : updateAdminService(editing!, payload);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-services'] });
      setEditing(null);
      setForm(EMPTY);
    },
    onError: () => Alert.alert('Erreur', 'Impossible d\'enregistrer.'),
  });

  const remove = useMutation({
    mutationFn: (id: number) => deleteAdminService(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-services'] }),
  });

  const startEdit = (s: any) => {
    setEditing(s.id);
    setForm({
      title: s.title || '',
      description: s.description || '',
      category_id: s.category?.id || 0,
      price_from: s.price_from?.toString() ?? '',
      price_to: s.price_to?.toString() ?? '',
      unit: s.unit || 'forfait',
      is_active: !!s.is_active,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.eyebrow}>— Services</Text>
            <Text style={styles.title}>Catalogue</Text>
          </View>
          <Pressable style={styles.btnGoldSm} onPress={() => { setEditing('new'); setForm(EMPTY); }}>
            <Text style={styles.btnGoldSmText}>+ Nouveau</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={services}
        keyExtractor={(s: any) => String(s.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>Aucun service.</Text>}
        renderItem={({ item }: { item: any }) => (
          <View style={[styles.card, !item.is_active && { opacity: 0.55 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cat}>{item.category?.name}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              {item.description && <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>}
              <Text style={styles.price}>
                {item.price_from ? `${Number(item.price_from).toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                {item.price_to ? ` – ${Number(item.price_to).toLocaleString('fr-FR')}` : ''}
                <Text style={styles.unit}>  {UNITS.find((u) => u.value === item.unit)?.label}</Text>
              </Text>
            </View>
            <View style={{ gap: 6 }}>
              <Pressable style={styles.iconBtn} onPress={() => startEdit(item)}>
                <Ionicons name="create-outline" size={16} color={c.fgMuted} />
              </Pressable>
              <Pressable
                style={styles.iconBtn}
                onPress={() => Alert.alert('Supprimer ?', `« ${item.title} »`, [
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

      {/* Modal édition */}
      <Modal visible={editing !== null} animationType="slide" onRequestClose={() => setEditing(null)}>
        <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: spacing.lg, paddingTop: 60 }}>
          <View style={styles.modalHead}>
            <Text style={styles.title}>{editing === 'new' ? 'Nouveau service' : 'Éditer'}</Text>
            <Pressable onPress={() => setEditing(null)} style={styles.iconBtn}>
              <Ionicons name="close" size={20} color={c.fg} />
            </Pressable>
          </View>

          <Text style={styles.label}>Titre</Text>
          <TextInput value={form.title} onChangeText={(v) => setForm({ ...form, title: v })} style={styles.input} />

          <Text style={styles.label}>Catégorie</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            {categories.map((cat: any) => (
              <Pressable
                key={cat.id}
                onPress={() => setForm({ ...form, category_id: cat.id })}
                style={[styles.pill, form.category_id === cat.id && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
              >
                <Text style={[styles.pillText, form.category_id === cat.id && { color: c.goldText, fontWeight: '600' }]}>{cat.name}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.label}>Description</Text>
          <TextInput value={form.description} onChangeText={(v) => setForm({ ...form, description: v })} multiline numberOfLines={3} style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]} />

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Prix min (FCFA)</Text>
              <TextInput value={form.price_from} onChangeText={(v) => setForm({ ...form, price_from: v })} keyboardType="numeric" style={styles.input} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Prix max (FCFA)</Text>
              <TextInput value={form.price_to} onChangeText={(v) => setForm({ ...form, price_to: v })} keyboardType="numeric" style={styles.input} />
            </View>
          </View>

          <Text style={styles.label}>Unité</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
            {UNITS.map((u) => (
              <Pressable
                key={u.value}
                onPress={() => setForm({ ...form, unit: u.value })}
                style={[styles.pill, form.unit === u.value && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
              >
                <Text style={[styles.pillText, form.unit === u.value && { color: c.goldText, fontWeight: '600' }]}>{u.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <Text style={styles.label}>Actif (visible publiquement)</Text>
            <Switch value={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })} trackColor={{ true: c.gold, false: c.line }} thumbColor={c.fg} />
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
  cat: { color: c.goldText, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginTop: 4 },
  cardDesc: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 4, lineHeight: 18 },
  price: { color: c.goldText, fontSize: fontSize.small, marginTop: 6, fontWeight: '600' as const },
  unit: { color: c.fgDim, fontSize: fontSize.caption, fontWeight: 'normal' as const },

  iconBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 1, borderColor: c.line },

  modalHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: spacing.md },
  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body, marginBottom: spacing.sm },
  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: spacing.sm },

  pill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
  pillText: { color: c.fgMuted, fontSize: 12 },
});
