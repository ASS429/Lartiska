import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  fetchAdminProject,
  fetchAdminCategories,
  updateAdminProject,
  uploadProjectImages,
  setProjectCover,
  deleteProjectImage,
  setImageBeforeAfter,
} from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function AdminProjectEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const { styles, c } = useStyles(makeStyles);

  const { data: project } = useQuery({
    queryKey: ['admin-project', id],
    queryFn: () => fetchAdminProject(id!),
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: fetchAdminCategories,
  });

  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: 0,
    city: '',
    materials: '',
    duration: '',
    status: 'draft' as 'draft' | 'published',
    featured: false,
  });

  useEffect(() => {
    if (project) {
      setForm({
        title: project.title || '',
        description: project.description || '',
        category_id: project.category?.id || 0,
        city: project.city || '',
        materials: (project as any).materials || '',
        duration: (project as any).duration || '',
        status: (project as any).status || 'draft',
        featured: !!(project as any).featured,
      });
    }
  }, [project]);

  const save = useMutation({
    mutationFn: () => updateAdminProject(id!, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-project', id] });
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      Alert.alert('✓ Enregistré');
    },
    onError: () => Alert.alert('Erreur', 'Impossible d\'enregistrer.'),
  });

  const cover = useMutation({
    mutationFn: (imgId: number) => setProjectCover(id!, imgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const removeImg = useMutation({
    mutationFn: (imgId: number) => deleteProjectImage(id!, imgId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const tagBeforeAfter = useMutation({
    mutationFn: ({ imgId, value }: { imgId: number; value: 'none' | 'before' | 'after' }) =>
      setImageBeforeAfter(id!, imgId, value),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-project', id] }),
  });

  const upload = useMutation({
    mutationFn: (files: { uri: string; name: string; type: string }[]) => uploadProjectImages(id!, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-project', id] });
      qc.invalidateQueries({ queryKey: ['admin-projects'] });
      Alert.alert('✓ Images ajoutées');
    },
    onError: (e: any) => Alert.alert('Erreur upload', e?.response?.data?.message || 'Réessayez.'),
  });

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Permission refusée', 'Autorisez l\'accès aux photos depuis les réglages.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 8,
      quality: 0.85,
    });
    if (res.canceled || !res.assets?.length) return;

    const files = res.assets.map((a, i) => {
      const ext = (a.uri.split('.').pop() || 'jpg').toLowerCase();
      return {
        uri: a.uri,
        name: a.fileName || `photo-${Date.now()}-${i}.${ext}`,
        type: a.mimeType || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'),
      };
    });

    upload.mutate(files);
  };

  if (!project) {
    return <View style={[styles.screen, { padding: spacing.xl }]}><Text style={{ color: c.fgMuted }}>Chargement…</Text></View>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
      <Text style={styles.eyebrow}>— Projet</Text>
      <Text style={styles.title}>{project.title}</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informations</Text>

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
        <TextInput
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          multiline
          numberOfLines={4}
          style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
        />

        <Text style={styles.label}>Ville</Text>
        <TextInput value={form.city} onChangeText={(v) => setForm({ ...form, city: v })} style={styles.input} />

        <Text style={styles.label}>Matériaux</Text>
        <TextInput value={form.materials} onChangeText={(v) => setForm({ ...form, materials: v })} style={styles.input} />

        <Text style={styles.label}>Durée</Text>
        <TextInput value={form.duration} onChangeText={(v) => setForm({ ...form, duration: v })} style={styles.input} />

        <View style={styles.row}>
          <Text style={styles.label}>Publié</Text>
          <Switch value={form.status === 'published'} onValueChange={(v) => setForm({ ...form, status: v ? 'published' : 'draft' })} trackColor={{ true: c.gold, false: c.line }} thumbColor={c.fg} />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>★ En vedette (Home)</Text>
          <Switch value={form.featured} onValueChange={(v) => setForm({ ...form, featured: v })} trackColor={{ true: c.gold, false: c.line }} thumbColor={c.fg} />
        </View>

        <Pressable style={[styles.btnGold, { marginTop: spacing.md }]} onPress={() => save.mutate()} disabled={save.isPending}>
          <Text style={styles.btnGoldText}>{save.isPending ? 'Enregistrement…' : 'Enregistrer'}</Text>
        </Pressable>
      </View>

      {/* Images */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Galerie ({project.images?.length || 0})</Text>

        <Pressable
          style={[styles.btnGold, { marginTop: spacing.sm, marginBottom: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }]}
          onPress={pickImages}
          disabled={upload.isPending}
        >
          <Ionicons name="cloud-upload-outline" size={18} color={c.ink} />
          <Text style={styles.btnGoldText}>{upload.isPending ? 'Upload…' : 'Ajouter des images'}</Text>
        </Pressable>

        {project.images?.length === 0 ? (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small }}>Aucune image.</Text>
        ) : (
          (project.images || []).map((img: any) => (
            <View key={img.id} style={styles.imageRow}>
              <Image source={{ uri: img.url }} style={styles.thumb} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 6 }}>
                  {img.is_cover && <View style={[styles.badge, { borderColor: c.gold }]}><Text style={[styles.badgeText, { color: c.goldText }]}>★ Cover</Text></View>}
                  {img.before_after === 'before' && <View style={styles.badge}><Text style={styles.badgeText}>Avant</Text></View>}
                  {img.before_after === 'after' && <View style={[styles.badge, { borderColor: c.gold }]}><Text style={[styles.badgeText, { color: c.goldText }]}>Après</Text></View>}
                </View>
                <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
                  {!img.is_cover && (
                    <Pressable style={styles.miniBtn} onPress={() => cover.mutate(img.id)}>
                      <Text style={styles.miniBtnText}>Cover</Text>
                    </Pressable>
                  )}
                  <Pressable style={styles.miniBtn} onPress={() => tagBeforeAfter.mutate({ imgId: img.id, value: 'before' })}>
                    <Text style={styles.miniBtnText}>Avant</Text>
                  </Pressable>
                  <Pressable style={styles.miniBtn} onPress={() => tagBeforeAfter.mutate({ imgId: img.id, value: 'after' })}>
                    <Text style={styles.miniBtnText}>Après</Text>
                  </Pressable>
                  <Pressable style={styles.miniBtn} onPress={() => tagBeforeAfter.mutate({ imgId: img.id, value: 'none' })}>
                    <Text style={styles.miniBtnText}>—</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.miniBtn, { borderColor: 'rgba(184,74,42,0.4)' }]}
                    onPress={() => Alert.alert('Supprimer cette image ?', '', [
                      { text: 'Annuler', style: 'cancel' },
                      { text: 'Supprimer', style: 'destructive', onPress: () => removeImg.mutate(img.id) },
                    ])}
                  >
                    <Ionicons name="trash-outline" size={12} color={c.rejected} />
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },

  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginBottom: spacing.sm },

  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body },

  row: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginTop: spacing.sm },

  pill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
  pillText: { color: c.fgMuted, fontSize: 12 },

  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },

  imageRow: { flexDirection: 'row' as const, gap: spacing.sm, marginBottom: spacing.sm, alignItems: 'center' as const },
  thumb: { width: 70, height: 70, borderRadius: radius.sm, backgroundColor: c.inkSoft },

  badge: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill },
  badgeText: { color: c.fgMuted, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  miniBtn: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.pill },
  miniBtnText: { color: c.fgMuted, fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase' as const, fontWeight: '600' as const },
});
