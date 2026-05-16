import { useEffect } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchAdminMessage, markAdminMessageRead } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

export default function AdminMessageDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const { styles, c } = useStyles(makeStyles);

  const { data: msg, isLoading } = useQuery({
    queryKey: ['admin-message', id],
    queryFn: () => fetchAdminMessage(id!),
    enabled: !!id,
  });

  // Marquer comme lu à l'ouverture
  const markRead = useMutation({
    mutationFn: () => markAdminMessageRead(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-message', id] });
      qc.invalidateQueries({ queryKey: ['admin-messages'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
  });

  useEffect(() => {
    if (msg && !msg.is_read) markRead.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [msg?.id]);

  if (isLoading || !msg) {
    return <View style={[styles.screen, { padding: spacing.xl }]}><Text style={{ color: c.fgMuted }}>Chargement…</Text></View>;
  }

  const phoneClean = msg.phone ? msg.phone.replace(/[^0-9]/g, '') : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg }}>
      <Text style={styles.eyebrow}>{msg.source}</Text>
      <Text style={styles.title}>{msg.subject || '(sans sujet)'}</Text>
      <Text style={styles.from}>
        <Text style={{ fontWeight: '700' }}>{msg.name}</Text>
        {msg.email ? `  ·  ${msg.email}` : ''}
        {msg.phone ? `  ·  ${msg.phone}` : ''}
      </Text>
      <Text style={styles.date}>
        Reçu le {new Date(msg.created_at).toLocaleString('fr-FR')}
      </Text>

      <View style={styles.body}>
        <Text style={styles.bodyText}>{msg.body}</Text>
      </View>

      <View style={styles.actions}>
        {msg.email && (
          <Pressable style={styles.btnGold} onPress={() => Linking.openURL(`mailto:${msg.email}`)}>
            <Ionicons name="mail-outline" size={18} color={c.ink} />
            <Text style={styles.btnGoldText}>Répondre par email</Text>
          </Pressable>
        )}
        {phoneClean && (
          <Pressable style={styles.btnGhost} onPress={() => Linking.openURL(`https://wa.me/${phoneClean}`)}>
            <Ionicons name="logo-whatsapp" size={18} color={c.whatsapp} />
            <Text style={styles.btnGhostText}>WhatsApp</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },
  from: { color: c.fg, fontSize: fontSize.body, marginTop: spacing.md },
  date: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: spacing.xs },

  body: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  bodyText: { color: c.fg, fontSize: fontSize.body, lineHeight: 24 },

  actions: { marginTop: spacing.lg, gap: spacing.sm },
  btnGold: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: spacing.xs, backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },
  btnGhost: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: spacing.xs, borderWidth: 1, borderColor: c.line, paddingVertical: 14, borderRadius: radius.pill },
  btnGhostText: { color: c.fg, fontSize: fontSize.body },
});
