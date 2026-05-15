import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

export default function LoginScreen() {
  const { login, status, error } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = async () => {
    try {
      const user = await login(email, password);
      router.replace(user.role === 'admin' ? '/(tabs)' : '/(tabs)/account');
    } catch { /* error géré dans le store */ }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.eyebrow}>— Connexion</Text>
        <Text style={styles.title}>Bienvenue sur <Text style={{ color: colors.gold, fontStyle: 'italic' }}>Lartiska</Text>.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={colors.fgDim}
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>Mot de passe</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.fgDim}
            style={styles.input}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <Pressable
            style={[styles.btnGold, { marginTop: spacing.lg, opacity: status === 'loading' ? 0.6 : 1 }]}
            disabled={status === 'loading'}
            onPress={onSubmit}
          >
            <Text style={styles.btnGoldText}>{status === 'loading' ? 'Connexion…' : 'Se connecter'}</Text>
          </Pressable>

          <Link href="/auth/register" asChild>
            <Pressable style={{ marginTop: spacing.lg, alignItems: 'center' }}>
              <Text style={styles.linkSmall}>Pas encore de compte ? Créer un compte →</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.xl, paddingTop: spacing.lg },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300', marginTop: spacing.xs, lineHeight: 32 },
  label: { color: colors.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 12, color: colors.fg, fontSize: fontSize.body },
  btnGold: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600' },
  linkSmall: { color: colors.gold, fontSize: fontSize.small },
  errorText: { color: colors.rust, marginTop: spacing.sm, fontSize: fontSize.small },
});
