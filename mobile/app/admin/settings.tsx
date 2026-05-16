import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { fetchAdminSettings, updateAdminSettings } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const SOCIAL_KEYS = [
  { key: 'social.facebook', label: 'Facebook' },
  { key: 'social.instagram', label: 'Instagram' },
  { key: 'social.tiktok', label: 'TikTok' },
  { key: 'social.snapchat', label: 'Snapchat' },
  { key: 'social.gmail', label: 'Gmail' },
];

export default function AdminSettingsScreen() {
  const { styles, c } = useStyles(makeStyles);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({ queryKey: ['admin-settings'], queryFn: fetchAdminSettings });

  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (!data) return;
    const flat: Record<string, any> = {};
    Object.values(data).forEach((group: any) => {
      Object.entries(group).forEach(([k, v]) => { flat[k] = v; });
    });
    setForm(flat);
  }, [data]);

  const save = useMutation({
    mutationFn: () => updateAdminSettings(form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      Alert.alert('✓ Réglages enregistrés');
    },
    onError: () => Alert.alert('Erreur'),
  });

  const phones: any[] = Array.isArray(form['contact.phones']) ? form['contact.phones'] : [];

  const updatePhone = (i: number, field: 'label' | 'phone' | 'whatsapp', value: string) => {
    const next = phones.map((p, idx) => (idx === i ? { ...p, [field]: value } : p));
    setForm({ ...form, 'contact.phones': next });
  };

  const addPhone = () => {
    setForm({ ...form, 'contact.phones': [...phones, { label: '', phone: '', whatsapp: '' }] });
  };

  const removePhone = (i: number) => {
    setForm({ ...form, 'contact.phones': phones.filter((_, idx) => idx !== i) });
  };

  if (isLoading) return <View style={[styles.screen, { padding: spacing.xl }]}><Text style={{ color: c.fgMuted }}>Chargement…</Text></View>;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}>
      <Text style={styles.eyebrow}>— Réglages</Text>
      <Text style={styles.title}>Configuration</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Société</Text>

        <Text style={styles.label}>Nom</Text>
        <TextInput value={form['company.name'] || ''} onChangeText={(v) => setForm({ ...form, 'company.name': v })} style={styles.input} />

        <Text style={styles.label}>Tagline</Text>
        <TextInput value={form['company.tagline'] || ''} onChangeText={(v) => setForm({ ...form, 'company.tagline': v })} style={styles.input} />

        <Text style={styles.label}>Essence (sous-titre)</Text>
        <TextInput value={form['company.essence'] || ''} onChangeText={(v) => setForm({ ...form, 'company.essence': v })} style={styles.input} placeholder="émeraude · or · pièce signature" placeholderTextColor={c.fgDim} />
      </View>

      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>Téléphones & WhatsApp</Text>
          <Pressable onPress={addPhone}>
            <Text style={styles.cardLink}>+ Ajouter</Text>
          </Pressable>
        </View>

        {phones.length === 0 ? (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small }}>Aucun numéro.</Text>
        ) : (
          phones.map((p, i) => (
            <View key={i} style={styles.phoneBlock}>
              <View style={styles.phoneHead}>
                <Text style={styles.phoneNum}>Téléphone {i + 1}</Text>
                <Pressable onPress={() => removePhone(i)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={16} color={c.rejected} />
                </Pressable>
              </View>
              <Text style={styles.label}>Libellé</Text>
              <TextInput value={p.label || ''} onChangeText={(v) => updatePhone(i, 'label', v)} style={styles.input} placeholder="Atelier, Devis…" placeholderTextColor={c.fgDim} />

              <Text style={styles.label}>Téléphone (avec +)</Text>
              <TextInput value={p.phone || ''} onChangeText={(v) => updatePhone(i, 'phone', v)} keyboardType="phone-pad" style={styles.input} placeholder="+221 78 544 63 63" placeholderTextColor={c.fgDim} />

              <Text style={styles.label}>WhatsApp (sans +)</Text>
              <TextInput value={p.whatsapp || ''} onChangeText={(v) => updatePhone(i, 'whatsapp', v)} keyboardType="phone-pad" style={styles.input} placeholder="221785446363" placeholderTextColor={c.fgDim} />
            </View>
          ))
        )}

        <Text style={styles.label}>Email principal</Text>
        <TextInput value={form['contact.email'] || ''} onChangeText={(v) => setForm({ ...form, 'contact.email': v })} keyboardType="email-address" autoCapitalize="none" style={styles.input} />

        <Text style={styles.label}>Adresse / atelier</Text>
        <TextInput value={form['contact.address'] || ''} onChangeText={(v) => setForm({ ...form, 'contact.address': v })} style={styles.input} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Réseaux sociaux</Text>
        {SOCIAL_KEYS.map((s) => (
          <View key={s.key}>
            <Text style={styles.label}>{s.label}</Text>
            <TextInput
              value={form[s.key] || ''}
              onChangeText={(v) => setForm({ ...form, [s.key]: v })}
              style={styles.input}
              autoCapitalize="none"
              placeholderTextColor={c.fgDim}
            />
          </View>
        ))}
      </View>

      <Pressable style={[styles.btnGold, { marginTop: spacing.sm }]} onPress={() => save.mutate()} disabled={save.isPending}>
        <Text style={styles.btnGoldText}>{save.isPending ? 'Enregistrement…' : 'Enregistrer'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },

  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  cardHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: spacing.sm },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg },
  cardLink: { color: c.goldText, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const, marginBottom: spacing.xs, marginTop: spacing.sm },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body, marginBottom: spacing.sm },

  phoneBlock: { borderTopWidth: 1, borderTopColor: c.lineSoft, paddingTop: spacing.sm, marginTop: spacing.sm },
  phoneHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const, marginBottom: spacing.xs },
  phoneNum: { color: c.goldText, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  iconBtn: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center' as const, alignItems: 'center' as const, borderWidth: 1, borderColor: c.line },

  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },
});
