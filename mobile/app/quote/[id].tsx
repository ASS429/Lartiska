import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Linking } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchMyQuote, respondToQuote } from '@/src/api/endpoints';
import { API_URL } from '@/src/api/client';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'En attente d\'étude', color: colors.pending },
  processing: { label: 'En cours d\'étude', color: colors.processing },
  sent: { label: 'Devis prêt à valider', color: colors.sent },
  accepted: { label: 'Accepté', color: colors.accepted },
  rejected: { label: 'Refusé', color: colors.rejected },
};

export default function QuoteDetailScreen() {
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

  const status = STATUS_LABELS[quote.status] || { label: quote.status, color: colors.fgDim };
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
    // Le PDF est protégé par token Bearer — on ne peut pas l'ouvrir directement.
    // On informe le user et propose d'aller le voir sur le site web où le download est géré.
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

      {/* Détails */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Votre demande</Text>
        <Row label="Description" value={quote.description || '—'} />
        <Row label="Surface" value={quote.surface_m2 ? `${quote.surface_m2} m²` : '—'} />
        {quote.total_amount && <Row label="Montant" value={`${quote.total_amount.toLocaleString('fr-FR')} FCFA`} />}
        <Row label="Créé le" value={quote.created_at ? new Date(quote.created_at).toLocaleDateString('fr-FR') : '—'} last />
      </View>

      {/* PDF */}
      {quote.has_pdf && (
        <Pressable style={styles.pdfCard} onPress={openPdf}>
          <Ionicons name="document-outline" size={22} color={colors.gold} />
          <View style={{ flex: 1, marginLeft: spacing.sm }}>
            <Text style={styles.pdfCardTitle}>PDF officiel disponible</Text>
            <Text style={styles.pdfCardLead}>Devis détaillé téléchargeable depuis votre espace web.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.fgMuted} />
        </Pressable>
      )}

      {/* Actions */}
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
                placeholderTextColor={colors.fgDim}
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
          <Text style={[styles.cardTitle, { color: colors.accepted }]}>✓ Devis accepté</Text>
          <Text style={styles.muted}>Tounkara va vous contacter pour planifier le démarrage du chantier.</Text>
        </View>
      )}

      {quote.status === 'rejected' && (
        <View style={[styles.card, { borderColor: 'rgba(184,74,42,0.3)' }]}>
          <Text style={[styles.cardTitle, { color: colors.rejected }]}>Devis refusé</Text>
          <Pressable style={[styles.btnGhost, { marginTop: spacing.md }]} onPress={() => router.push('/(tabs)/devis')}>
            <Text style={styles.btnGhostText}>Nouvelle demande →</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={[styles.whatsappBtn, { marginTop: spacing.md }]} onPress={() => Linking.openURL('https://wa.me/221785446363')}>
        <Ionicons name="logo-whatsapp" size={20} color={colors.whatsapp} />
        <Text style={styles.whatsappText}>Discuter sur WhatsApp</Text>
      </Pressable>
    </ScrollView>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={[styles.row, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  ref: { color: colors.gold, fontFamily: 'monospace', fontSize: fontSize.small },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300', lineHeight: 36, marginTop: spacing.xs },
  badge: { borderWidth: 1, paddingHorizontal: spacing.sm, paddingVertical: 6, borderRadius: radius.pill },
  badgeText: { fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase' },

  card: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  cardTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginBottom: spacing.sm },
  row: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.line },
  rowLabel: { color: colors.gold, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' },
  rowValue: { color: colors.fg, fontSize: fontSize.body, marginTop: 2 },

  pdfCard: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)', backgroundColor: 'rgba(212,175,55,0.06)', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  pdfCardTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.body },
  pdfCardLead: { color: colors.fgMuted, fontSize: fontSize.caption, marginTop: 2 },

  label: { color: colors.fgMuted, fontSize: 10, letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: colors.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: colors.fg, fontSize: fontSize.body },

  btnGold: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600' },
  btnGhost: { borderWidth: 1, borderColor: colors.line, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGhostText: { color: colors.fg, fontSize: fontSize.body },
  linkRust: { color: colors.rust, fontSize: fontSize.small, letterSpacing: 1.5, textTransform: 'uppercase' },

  whatsappBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.06)', paddingVertical: 12, borderRadius: radius.pill },
  whatsappText: { color: colors.fg, fontSize: fontSize.body },

  muted: { color: colors.fgMuted, fontSize: fontSize.small, marginTop: spacing.xs },
});
