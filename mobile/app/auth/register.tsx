import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

export default function RegisterScreen() {
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>— Créer un compte</Text>
        <Text style={styles.title}>Rejoignez <Text style={{ color: colors.gold, fontStyle: 'italic' }}>Lartiska</Text>.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <FieldLabel>Nom complet</FieldLabel>
          <TextInput value={form.name} onChangeText={set('name')} placeholderTextColor={colors.fgDim} style={styles.input} />

          <FieldLabel mt>Email</FieldLabel>
          <TextInput value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={colors.fgDim} style={styles.input} />

          <FieldLabel mt>Téléphone</FieldLabel>
          <TextInput value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" placeholderTextColor={colors.fgDim} style={styles.input} />

          <FieldLabel mt>Mot de passe (min. 8)</FieldLabel>
          <TextInput value={form.password} onChangeText={set('password')} secureTextEntry placeholderTextColor={colors.fgDim} style={styles.input} />

          <FieldLabel mt>Confirmer le mot de passe</FieldLabel>
          <TextInput value={form.password_confirmation} onChangeText={set('password_confirmation')} secureTextEntry placeholderTextColor={colors.fgDim} style={styles.input} />

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

function FieldLabel({ children, mt }: { children: React.ReactNode; mt?: boolean }) {
  return <Text style={[styles.label, mt && { marginTop: spacing.md }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300', marginTop: spacing.xs, lineHeight: 32 },
  label: { color: colors.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.fg, fontSize: fontSize.body },
  btnGold: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600' },
  errorText: { color: colors.rust, marginTop: spacing.sm, fontSize: fontSize.small },
});
