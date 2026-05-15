import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchServices, submitQuote } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

export default function DevisScreen() {
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState({
    service_id: '',
    description: '',
    surface_m2: '',
    estimated_budget: '',
    client_name: user?.name ?? '',
    client_email: user?.email ?? '',
    client_phone: user?.phone ?? '',
    client_city: '',
    site_address: '',
  });

  const { data: services } = useQuery({ queryKey: ['services'], queryFn: fetchServices });

  const mutation = useMutation({
    mutationFn: () =>
      submitQuote({
        ...form,
        service_id: form.service_id ? Number(form.service_id) : null,
        surface_m2: form.surface_m2 ? Number(form.surface_m2) : null,
        estimated_budget: form.estimated_budget ? Number(form.estimated_budget) : null,
      }),
  });

  const set = (key: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  if (mutation.isSuccess) {
    const ref = mutation.data?.data?.reference;
    return (
      <View style={[styles.screen, { padding: spacing.xl, justifyContent: 'center' }]}>
        <Text style={styles.eyebrowDeco}>✦ Demande reçue</Text>
        <Text style={[styles.title, { textAlign: 'center', marginTop: spacing.md }]}>Merci !</Text>
        <Text style={styles.lead}>
          Référence : <Text style={{ color: colors.gold }}>{ref}</Text>{'\n\n'}
          Tounkara étudie votre projet et revient sous 48h.
        </Text>
        <Pressable
          style={[styles.btnGold, { marginTop: spacing.xl }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.btnGoldText}>Retour à l'accueil</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.bg }}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>— Demande de devis</Text>
        <Text style={styles.title}>Décrivez votre projet</Text>
        <Text style={styles.lead}>
          Réponse en moins de 24h ouvrées avec un devis détaillé.
        </Text>

        <Field label="Type de prestation">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.xs }}>
            {(services ?? []).map((s) => {
              const active = String(form.service_id) === String(s.id);
              return (
                <Pressable
                  key={s.id}
                  onPress={() => set('service_id')(String(s.id))}
                  style={[
                    styles.servicePill,
                    active && { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.12)' },
                  ]}
                >
                  <Text style={[styles.servicePillText, active && { color: colors.gold }]}>{s.title}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </Field>

        <Field label="Description du projet">
          <TextInput
            value={form.description}
            onChangeText={set('description')}
            multiline
            numberOfLines={5}
            placeholder="Ex : fresque murale dans le salon, env 12 m², ambiance émeraude et or…"
            placeholderTextColor={colors.fgDim}
            style={[styles.input, { minHeight: 110, textAlignVertical: 'top' }]}
          />
        </Field>

        <View style={styles.row}>
          <Field label="Surface (m²)" half>
            <TextInput
              value={form.surface_m2}
              onChangeText={set('surface_m2')}
              keyboardType="numeric"
              placeholderTextColor={colors.fgDim}
              style={styles.input}
            />
          </Field>
          <Field label="Budget (FCFA)" half>
            <TextInput
              value={form.estimated_budget}
              onChangeText={set('estimated_budget')}
              keyboardType="numeric"
              placeholderTextColor={colors.fgDim}
              style={styles.input}
            />
          </Field>
        </View>

        <Field label="Nom complet">
          <TextInput value={form.client_name} onChangeText={set('client_name')} style={styles.input} placeholderTextColor={colors.fgDim} />
        </Field>

        <View style={styles.row}>
          <Field label="Email" half>
            <TextInput value={form.client_email} onChangeText={set('client_email')} autoCapitalize="none" keyboardType="email-address" style={styles.input} placeholderTextColor={colors.fgDim} />
          </Field>
          <Field label="Téléphone" half>
            <TextInput value={form.client_phone} onChangeText={set('client_phone')} keyboardType="phone-pad" style={styles.input} placeholderTextColor={colors.fgDim} />
          </Field>
        </View>

        <View style={styles.row}>
          <Field label="Ville" half>
            <TextInput value={form.client_city} onChangeText={set('client_city')} style={styles.input} placeholderTextColor={colors.fgDim} />
          </Field>
          <Field label="Adresse chantier" half>
            <TextInput value={form.site_address} onChangeText={set('site_address')} style={styles.input} placeholderTextColor={colors.fgDim} />
          </Field>
        </View>

        {mutation.isError && (
          <Text style={styles.errorText}>
            Erreur lors de l'envoi. Vérifiez votre connexion.
          </Text>
        )}

        <Pressable
          style={[styles.btnGold, { marginTop: spacing.lg, opacity: mutation.isPending ? 0.6 : 1 }]}
          disabled={mutation.isPending}
          onPress={() => mutation.mutate()}
        >
          <Text style={styles.btnGoldText}>
            {mutation.isPending ? 'Envoi…' : 'Envoyer ma demande'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, half, children }: { label: string; half?: boolean; children: React.ReactNode }) {
  return (
    <View style={[{ marginBottom: spacing.md }, half && { flex: 1 }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: 80 },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  eyebrowDeco: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300', marginTop: spacing.xs, lineHeight: 44 },
  lead: { color: colors.fgMuted, fontSize: fontSize.body, lineHeight: 22, marginTop: spacing.md, marginBottom: spacing.xl, textAlign: 'center' },
  fieldLabel: { color: colors.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.fg, fontSize: fontSize.body },
  row: { flexDirection: 'row', gap: spacing.sm },
  servicePill: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, marginRight: spacing.xs },
  servicePillText: { color: colors.fgMuted, fontSize: 12 },
  btnGold: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600', letterSpacing: 0.5 },
  errorText: { color: colors.rust, marginTop: spacing.md, fontSize: fontSize.small },
});
