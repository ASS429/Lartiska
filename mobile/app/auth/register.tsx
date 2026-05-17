import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function RegisterScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { register, status, error } = useAuthStore();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', password_confirmation: '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async () => {
    try {
      const { claimed } = await register(form);
      if (claimed > 0) {
        Alert.alert('✦ Bienvenue', `${claimed} demande${claimed > 1 ? 's' : ''} récupérée${claimed > 1 ? 's' : ''} sous votre compte.`);
      }
      router.replace('/(tabs)/account');
    } catch { /* error géré */ }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logoHalo}>
            <Image source={require('@/assets/lartiska-logo.jpg')} style={styles.logoImg} />
          </View>
          <Text style={styles.wordmark}>Lartis<Text style={{ fontStyle: 'italic', color: c.gold }}>Ka</Text></Text>
        </View>
        <Text style={styles.eyebrow}>— Créer un compte</Text>
        <Text style={styles.title}>Rejoignez <Text style={{ color: c.goldText, fontStyle: 'italic' }}>Lartiska</Text>.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <FieldLabel styles={styles}>Nom complet</FieldLabel>
          <TextInput value={form.name} onChangeText={set('name')} placeholderTextColor={c.fgDim} style={styles.input} />

          <FieldLabel styles={styles} mt>Email</FieldLabel>
          <TextInput value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={c.fgDim} style={styles.input} />

          <FieldLabel styles={styles} mt>Téléphone</FieldLabel>
          <TextInput value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholderTextColor={c.fgDim} style={styles.input} />

          <FieldLabel styles={styles} mt>Mot de passe (min. 8)</FieldLabel>
          <TextInput value={form.password} onChangeText={set('password')} secureTextEntry placeholderTextColor={c.fgDim} style={styles.input} />

          <FieldLabel styles={styles} mt>Confirmer le mot de passe</FieldLabel>
          <TextInput value={form.password_confirmation} onChangeText={set('password_confirmation')} secureTextEntry placeholderTextColor={c.fgDim} style={styles.input} />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.btnGold, { marginTop: spacing.lg, opacity: status === 'loading' ? 0.6 : 1 }]}
            disabled={status === 'loading'}
            onPress={onSubmit}
          >
            <Text style={styles.btnGoldText}>{status === 'loading' ? 'Création…' : 'Créer mon compte'}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldLabel({ children, mt, styles }: { children: React.ReactNode; mt?: boolean; styles: any }) {
  return <Text style={[styles.label, mt && { marginTop: spacing.md }]}>{children}</Text>;
}

const makeStyles = (c: ThemeColors) => ({
  content: { padding: spacing.xl, paddingTop: 80 },
  brand: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.sm, marginBottom: spacing.xl },
  logoHalo: {
    width: 44, height: 44, borderRadius: 22, overflow: 'hidden' as const,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.5)',
    shadowColor: '#D4AF37', shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  logoImg: { width: '100%' as const, height: '100%' as const, resizeMode: 'cover' as const },
  wordmark: { color: c.fg, fontFamily: 'serif', fontSize: 22, fontWeight: '500' as const, letterSpacing: 0.5 },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs, lineHeight: 36 },
  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, marginBottom: spacing.xs, fontWeight: '600' as const },
  input: {
    borderWidth: 1, borderColor: c.line,
    backgroundColor: c.surface,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: 12,
    color: c.fg, fontSize: fontSize.body,
  },
  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '700' as const, letterSpacing: 0.3 },
  errorText: { color: c.rust, marginTop: spacing.sm, fontSize: fontSize.small },
});
