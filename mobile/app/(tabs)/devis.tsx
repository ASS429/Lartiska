import { useState } from 'react';
import { ScrollView, Text, TextInput, View, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useQuery, useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchCategories, submitQuote } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  'peinture': 'brush-outline',
  'peinture-fresques': 'brush-outline',
  'plafonnage': 'sparkles-outline',
  'carrelage': 'grid-outline',
  'mosaique': 'grid-outline',
  'decoration': 'flower-outline',
  'sur-mesure': 'cut-outline',
};

export default function DevisScreen() {
  const { styles, c } = useStyles(makeStyles);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [surface, setSurface] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const mutation = useMutation({
    mutationFn: () =>
      submitQuote({
        service_id: categoryId,
        description,
        surface_m2: surface ? Number(surface) : null,
        client_name: name,
        client_email: email,
        client_phone: phone,
      }),
  });

  const selectedCategory = categories?.find((c) => c.id === categoryId);

  // ─── Success state ─────────────────────────────────────────
  if (mutation.isSuccess) {
    const ref = mutation.data?.data?.reference;
    return (
      <View style={[styles.screen, { padding: spacing.xl, justifyContent: 'center' }]}>
        <View style={styles.successBadge}>
          <Ionicons name="checkmark" size={42} color={c.emerald} />
        </View>
        <Text style={styles.eyebrowDeco}>✦ Demande envoyée ✦</Text>
        <Text style={[styles.title, { textAlign: 'center', marginTop: spacing.md }]}>
          Merci, <Text style={styles.italicGold}>{name || 'cher client'}.</Text>
        </Text>
        <Text style={styles.lead}>
          Référence : <Text style={{ color: c.goldText, fontWeight: '700' }}>{ref}</Text>
          {'\n\n'}
          Tounkara étudie votre projet et revient sous 48h ouvrées.
        </Text>
        <Pressable
          style={[styles.btnGold, { marginTop: spacing.xl, alignSelf: 'center' }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.btnGoldText}>Retour à l'accueil</Text>
        </Pressable>
      </View>
    );
  }

  // ─── Wizard ─────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: c.bg }}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Progress dots */}
        <View style={styles.pips}>
          <View style={[styles.pip, step >= 1 && styles.pipActive]} />
          <View style={[styles.pip, step >= 2 && styles.pipActive]} />
          <View style={[styles.pip, step >= 3 && styles.pipActive]} />
        </View>

        <Text style={styles.eyebrowDeco}>Étape {step} / 3</Text>

        {/* Lyric title */}
        <Text style={[styles.title, { textAlign: 'center' }]}>
          {step === 1 && (<>Quelle est <Text style={styles.italicGold}>votre vision</Text> ?</>)}
          {step === 2 && (<>Parlez-nous <Text style={styles.italicGold}>du projet.</Text></>)}
          {step === 3 && (<>Où vous <Text style={styles.italicGold}>joindre</Text> ?</>)}
        </Text>

        {/* ── STEP 1 : Catégorie ─────────────────── */}
        {step === 1 && (
          <View style={{ marginTop: spacing.xl }}>
            <Text style={[styles.lead, { marginBottom: spacing.lg }]}>
              Choisissez la catégorie qui correspond le mieux à votre projet. Vous pourrez préciser à l'étape suivante.
            </Text>

            <View style={styles.catGrid}>
              {(categories ?? []).map((cat) => {
                const active = categoryId === cat.id;
                return (
                  <Pressable
                    key={cat.id}
                    onPress={() => setCategoryId(cat.id)}
                    style={[styles.catCard, active && styles.catCardActive]}
                  >
                    <View style={[styles.catIcon, active && { backgroundColor: 'rgba(212,175,55,0.25)' }]}>
                      <Ionicons
                        name={CATEGORY_ICON[cat.slug] ?? 'sparkles-outline'}
                        size={22}
                        color={c.goldText}
                      />
                    </View>
                    <Text style={[styles.catTitle, active && { color: c.goldText }]}>{cat.name}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={[styles.navRow, { justifyContent: 'center' }]}>
              <Pressable
                style={[styles.btnGold, !categoryId && { opacity: 0.4 }]}
                disabled={!categoryId}
                onPress={() => setStep(2)}
              >
                <Text style={styles.btnGoldText}>Continuer →</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── STEP 2 : Description ─────────────────── */}
        {step === 2 && (
          <View style={{ marginTop: spacing.xl }}>
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Surface estimée (m²)</Text>
              <TextInput
                value={surface}
                onChangeText={setSurface}
                keyboardType="numeric"
                placeholder="45"
                placeholderTextColor={c.fgDim}
                style={styles.input}
              />

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Décrivez votre projet</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={5}
                placeholder="Mur d'art émeraude marbré avec veines dorées pour le salon de réception…"
                placeholderTextColor={c.fgDim}
                style={[styles.input, { minHeight: 110, textAlignVertical: 'top', paddingTop: 12 }]}
              />
            </View>

            <View style={styles.navRow}>
              <Pressable style={styles.btnGhost} onPress={() => setStep(1)}>
                <Text style={styles.btnGhostText}>← Retour</Text>
              </Pressable>
              <Pressable style={styles.btnGold} onPress={() => setStep(3)}>
                <Text style={styles.btnGoldText}>Continuer →</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── STEP 3 : Contact ─────────────────── */}
        {step === 3 && (
          <View style={{ marginTop: spacing.xl }}>
            <View style={styles.card}>
              <Text style={styles.fieldLabel}>Nom complet</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Aminata Sow"
                placeholderTextColor={c.fgDim}
                style={styles.input}
              />

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Téléphone (WhatsApp préféré)</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+221 78 544 63 63"
                placeholderTextColor={c.fgDim}
                style={styles.input}
              />

              <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="aminata@exemple.com"
                placeholderTextColor={c.fgDim}
                style={styles.input}
              />

              {/* Récap */}
              <View style={styles.recap}>
                <Text style={styles.recapText}>
                  Récapitulatif —{' '}
                  <Text style={{ color: c.goldText, fontWeight: '700' }}>
                    {selectedCategory?.name || 'catégorie'}
                  </Text>
                  {surface ? ` · ${surface} m²` : ''}
                </Text>
              </View>
            </View>

            {mutation.isError && (
              <Text style={styles.errorText}>
                Erreur lors de l'envoi. Vérifiez votre connexion.
              </Text>
            )}

            <View style={styles.navRow}>
              <Pressable style={styles.btnGhost} onPress={() => setStep(2)}>
                <Text style={styles.btnGhostText}>← Retour</Text>
              </Pressable>
              <Pressable
                style={[styles.btnGold, { opacity: mutation.isPending ? 0.6 : 1 }]}
                disabled={mutation.isPending || !name || !email}
                onPress={() => mutation.mutate()}
              >
                <Text style={styles.btnGoldText}>
                  {mutation.isPending ? 'Envoi…' : 'Envoyer →'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: 80 },

  pips: {
    flexDirection: 'row' as const,
    gap: 6,
    justifyContent: 'center' as const,
    marginBottom: spacing.lg,
  },
  pip: {
    width: 28,
    height: 3,
    borderRadius: 2,
    backgroundColor: c.line,
  },
  pipActive: { backgroundColor: c.gold },

  eyebrow: {
    color: c.goldText,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  eyebrowDeco: {
    color: c.goldText,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    fontWeight: '600' as const,
    marginBottom: spacing.sm,
  },
  title: {
    color: c.fg,
    fontFamily: 'serif',
    fontSize: 32,
    fontWeight: '300' as const,
    marginTop: spacing.xs,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  italicGold: { color: c.goldText, fontStyle: 'italic' as const, fontWeight: '300' as const },
  lead: {
    color: c.fgMuted,
    fontSize: fontSize.body,
    lineHeight: 24,
    marginTop: spacing.md,
    textAlign: 'center' as const,
  },

  card: {
    backgroundColor: c.surface,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  fieldLabel: {
    color: c.fgMuted,
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.inkSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    color: c.fg,
    fontSize: fontSize.body,
  },

  catGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  catCard: {
    width: '48%' as const,
    backgroundColor: c.surface,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center' as const,
    gap: spacing.sm,
    minHeight: 130,
    justifyContent: 'center' as const,
  },
  catCardActive: {
    borderColor: c.gold,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  catIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212,175,55,0.15)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  catTitle: {
    color: c.fg,
    fontFamily: 'serif',
    fontSize: 15,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },

  recap: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1,
    borderColor: c.line,
  },
  recapText: { color: c.fgMuted, fontSize: 12, lineHeight: 18 },

  navRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  btnGold: {
    backgroundColor: c.gold,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center' as const,
  },
  btnGoldText: { color: c.ink, fontSize: fontSize.small, fontWeight: '700' as const, letterSpacing: 0.5 },
  btnGhost: {
    borderWidth: 1,
    borderColor: c.line,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center' as const,
  },
  btnGhostText: { color: c.fg, fontSize: fontSize.small, fontWeight: '500' as const },

  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(52,211,153,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52,211,153,0.4)',
    alignSelf: 'center' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.lg,
  },

  errorText: {
    color: c.rust,
    marginTop: spacing.md,
    fontSize: fontSize.small,
    textAlign: 'center' as const,
  },
});
