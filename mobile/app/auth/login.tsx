import { useState } from 'react';
import { Image, Pressable, ScrollView, Text, TextInput, View, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Link } from 'expo-router';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function LoginScreen() {
  const { styles, c } = useStyles(makeStyles);
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
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brand}>
          <View style={styles.logoHalo}>
            <Image source={require('@/assets/lartiska-logo.jpg')} style={styles.logoImg} />
          </View>
          <Text style={styles.wordmark}>Lartis<Text style={{ fontStyle: 'italic', color: c.gold }}>Ka</Text></Text>
        </View>
        <Text style={styles.eyebrow}>— Connexion</Text>
        <Text style={styles.title}>Bienvenue sur <Text style={{ color: c.goldText, fontStyle: 'italic' }}>Lartiska</Text>.</Text>

        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor={c.fgDim}
            style={styles.input}
          />

          <Text style={[styles.label, { marginTop: spacing.md }]}>Mot de passe</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={c.fgDim}
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
  linkSmall: { color: c.goldText, fontSize: fontSize.small, fontWeight: '500' as const },
  errorText: { color: c.rust, marginTop: spacing.sm, fontSize: fontSize.small },
});
