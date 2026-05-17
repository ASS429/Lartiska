import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View, Linking } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyQuote, respondToQuote } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const statusLabels = (c: ThemeColors): Record<string, { label: string; color: string }> => ({
  pending: { label: 'En attente d\'étude', color: c.pending },
  processing: { label: 'En cours d\'étude', color: c.processing },
  sent: { label: 'Devis prêt à valider', color: c.sent },
  accepted: { label: 'Accepté', color: c.accepted },
  rejected: { label: 'Refusé', color: c.rejected },
});

export default function QuoteDetailScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const [showChanges, setShowChanges] = useState(false);
  const [comment, setComment] = useState('');

  const { data: quote, isLoading } = useQuery({
    queryKey: ['my-quote', id],
    queryFn: () => fetchMyQuote(id!),
    enabled: !!id,
  });

  const respond = useMutation({
    mutationFn: (action: 'accept' | 'reject' | 'request_changes') => respondToQuote(id!, action, comment),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['my-quote', id] });
      qc.invalidateQueries({ queryKey: ['my-quotes'] });
      setShowChanges(false);
      setComment('');
    },
    onError: (e: any) => Alert.alert('Erreur', e?.response?.data?.message || 'Action impossible.'),
  });

  if (isLoading) return <View style={styles.screen}><Text style={styles.muted}>Chargement…</Text></View>;
  if (!quote) return <View style={styles.screen}><Text style={styles.muted}>Devis introuvable.</Text></View>;

  const labels = statusLabels(c);
  const status = labels[quote.status] || { label: quote.status, color: c.fgDim };
  const canRespond = quote.status === 'sent';

  const onAccept = () => Alert.alert(
    'Accepter ce devis ?',
    `Confirmer l'acceptation du devis ${quote.reference} ?`,
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Confirmer', onPress: () => respond.mutate('accept') },
    ],
  );

  const onReject = () => Alert.alert(
    'Refuser ce devis ?',
    'Cette action est définitive.',
    [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Refuser', style: 'destructive', onPress: () => respond.mutate('reject') },
    ],
  );

  const openPdf = async () => {
    Alert.alert(
      'Télécharger le PDF',
      `Pour télécharger le PDF officiel du devis, ouvrez votre espace web sur lartiska.onrender.com/account/quotes/${quote.id}.`,
      [
        { text: 'OK' },
        { text: 'Ouvrir le site', onPress: () => Linking.openURL(`https://lartiska.onrender.com/account/quotes/${quote.id}`) },
      ],
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 40 }}>
      <Text style={styles.ref}>{quote.reference}</Text>
      <Text style={styles.title}>{quote.service?.title || 'Demande de devis'}</Text>

      <View style={[styles.badge, { borderColor: status.color, marginTop: spacing.md, alignSelf: 'flex-start' }]}>
        <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Votre demande</Text>
        <Row styles={styles} label="Description" value={quote.description || '—'} />
        <Row styles={styles} label="Surface" value={quote.surface_m2 ? `${quote.surface_m2} m²` : '—'} />
        {quote.total_amount && <Row styles={styles} label="Montant" value={`${quote.total_amount.toLocaleString('fr-FR')} FCFA`} />}
        <Row styles={styles} label="Créé le" value={quote.created_at ? new Date(quote.created_at).toLocaleDateString('fr-FR') : '—'} last />
      </View>

      {quote.has_pdf && (
        <Pressable style={styles.pdfCard} onPress={openPdf}>
          <Ionicons name="document-outline" size={22} color={c.gold} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.pdfCardTitle}>PDF officiel disponible</Text>
            <Text style={styles.pdfCardLead}>Devis détaillé téléchargeable depuis votre espace web.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.fgMuted} />
        </Pressable>
      )}

      {canRespond && (
        <View style={[styles.card, { marginTop: spacing.md }]}>
          <Text style={styles.cardTitle}>Votre décision</Text>

          {!showChanges ? (
            <>
              <Pressable style={[styles.btnGold, { marginTop: spacing.md }]} onPress={onAccept} disabled={respond.isPending}>
                <Text style={styles.btnGoldText}>✓ Accepter le devis</Text>
              </Pressable>
              <Pressable style={[styles.btnGhost, { marginTop: spacing.sm }]} onPress={() => setShowChanges(true)} disabled={respond.isPending}>
                <Text style={styles.btnGhostText}>↺ Demander une modification</Text>
              </Pressable>
              <Pressable style={{ marginTop: spacing.md, alignItems: 'center' }} onPress={onReject} disabled={respond.isPending}>
                <Text style={styles.linkRust}>Refuser</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={[styles.label, { marginTop: spacing.md }]}>Que souhaitez-vous ajuster ?</Text>
              <TextInput
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                placeholderTextColor={c.fgDim}
                style={[styles.input, { minHeight: 90, textAlignVertical: 'top' }]}
              />
              <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
                <Pressable style={[styles.btnGhost, { flex: 1 }]} onPress={() => setShowChanges(false)}>
                  <Text style={styles.btnGhostText}>Annuler</Text>
                </Pressable>
                <Pressable
                  style={[styles.btnGold, { flex: 1 }]}
                  onPress={() => respond.mutate('request_changes')}
                  disabled={respond.isPending || comment.length < 5}
                >
                  <Text style={styles.btnGoldText}>Envoyer</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      )}

      {quote.status === 'accepted' && (
        <View style={[styles.card, { borderColor: 'rgba(52,211,153,0.3)' }]}>
          <Text style={[styles.cardTitle, { color: c.accepted }]}>✓ Devis accepté</Text>
          <Text style={styles.muted}>Tounkara va vous contacter pour planifier le démarrage du chantier.</Text>
        </View>
      )}

      {quote.status === 'rejected' && (
        <View style={[styles.card, { borderColor: 'rgba(184,74,42,0.3)' }]}>
          <Text style={[styles.cardTitle, { color: c.rejected }]}>Devis refusé</Text>
          <Pressable style={[styles.btnGhost, { marginTop: spacing.md }]} onPress={() => router.push('/(tabs)/devis')}>
            <Text style={styles.btnGhostText}>Nouvelle demande →</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={[styles.whatsappBtn, { marginTop: spacing.md }]} onPress={() => Linking.openURL('https://wa.me/221785446363')}>
        <Ionicons name="logo-whatsapp" size={20} color={c.whatsapp} />
        <Text style={styles.whatsappText}>Discuter sur WhatsApp</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value, last, styles }: { label: string; value: string; last?: boolean; styles: any }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  ref: { color: c.goldText, fontFamily: 'monospace', fontSize: fontSize.small },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, lineHeight: 36, marginTop: spacing.xs },
  badge: { borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  badgeText: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' as const },

  card: { borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginBottom: spacing.sm },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: c.lineSoft },
  rowLabel: { color: c.goldText, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  rowValue: { color: c.fg, fontSize: fontSize.body, marginTop: 2 },

  pdfCard: { flexDirection: 'row' as const, alignItems: 'center' as const, borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', backgroundColor: 'rgba(212,175,55,0.06)', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  pdfCardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.body },
  pdfCardLead: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 2 },

  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase' as const, marginBottom: spacing.xs, fontWeight: '600' as const },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: c.inkSoft, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body },

  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '700' as const },
  btnGhost: { borderWidth: 1, borderColor: c.line, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGhostText: { color: c.fg, fontSize: fontSize.body },
  linkRust: { color: c.rust, fontSize: fontSize.small, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  whatsappBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, gap: spacing.sm, borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.06)', paddingVertical: 12, borderRadius: radius.pill },
  whatsappText: { color: c.fg, fontSize: fontSize.body },

  muted: { color: c.fgMuted, fontSize: fontSize.small, marginTop: spacing.xs },
});
