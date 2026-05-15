import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchAdminQuote,
  updateAdminQuote,
  generateQuotePdf,
  sendQuoteToClient,
} from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En cours d\'étude' },
  { value: 'sent', label: 'Devis envoyé' },
  { value: 'accepted', label: 'Accepté' },
  { value: 'rejected', label: 'Refusé' },
];

export default function AdminQuoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const qc = useQueryClient();
  const { styles, c } = useStyles(makeStyles);

  const { data: quote, isLoading } = useQuery({
    queryKey: ['admin-quote', id],
    queryFn: () => fetchAdminQuote(id!),
    enabled: !!id,
  });

  const [status, setStatus] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');

  useEffect(() => {
    if (quote) {
      setStatus(quote.status);
      setTotalAmount(quote.total_amount ? String(quote.total_amount) : '');
      setAdminNotes((quote as any).admin_notes || '');
    }
  }, [quote]);

  const updateMutation = useMutation({
    mutationFn: () => updateAdminQuote(id!, {
      status,
      total_amount: totalAmount ? Number(totalAmount) : null,
      admin_notes: adminNotes || null,
    }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quote', id] });
      qc.invalidateQueries({ queryKey: ['admin-quotes'] });
      qc.invalidateQueries({ queryKey: ['admin-dashboard'] });
      Alert.alert('✓ Mis à jour');
    },
    onError: () => Alert.alert('Erreur', 'Impossible d\'enregistrer.'),
  });

  const generatePdfMutation = useMutation({
    mutationFn: () => generateQuotePdf(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quote', id] });
      Alert.alert('✓ PDF généré', 'Le devis est prêt à être envoyé.');
    },
    onError: () => Alert.alert('Erreur', 'Génération PDF échouée.'),
  });

  const sendMutation = useMutation({
    mutationFn: () => sendQuoteToClient(id!),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-quote', id] });
      qc.invalidateQueries({ queryKey: ['admin-quotes'] });
      Alert.alert('✓ Envoyé', 'Le client a reçu le devis par email.');
    },
    onError: () => Alert.alert('Erreur', 'Envoi mail échoué.'),
  });

  if (isLoading || !quote) {
    return <View style={[styles.screen, { padding: spacing.xl }]}><Text style={{ color: c.fgMuted }}>Chargement…</Text></View>;
  }

  const whatsappLink = quote.client_phone
    ? `https://wa.me/${quote.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${quote.client_name.split(' ')[0]}, à propos de votre demande ${quote.reference} chez Lartiska...`)}`
    : null;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ padding: spacing.lg, paddingBottom: 60 }}>
      <Text style={styles.ref}>{quote.reference}</Text>
      <Text style={styles.title}>{quote.client_name}</Text>
      <Text style={styles.contact}>{quote.client_email} · {quote.client_phone}</Text>

      {/* Demande */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Demande</Text>
        <Row label="Service" value={quote.service?.title || '—'} c={c} />
        <Row label="Description" value={quote.description || '—'} c={c} />
        <Row label="Surface" value={quote.surface_m2 ? `${quote.surface_m2} m²` : '—'} c={c} />
        <Row label="Reçu le" value={quote.created_at ? new Date(quote.created_at).toLocaleString('fr-FR') : '—'} c={c} last />
      </View>

      {/* Édition */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Action admin</Text>

        <Text style={styles.label}>Statut</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: spacing.md }}>
          {STATUS_OPTIONS.map((s) => (
            <Pressable
              key={s.value}
              onPress={() => setStatus(s.value)}
              style={[styles.statusPill, status === s.value && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' }]}
            >
              <Text style={[styles.statusPillText, status === s.value && { color: c.goldText, fontWeight: '600' }]}>{s.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Montant total (FCFA)</Text>
        <TextInput
          value={totalAmount}
          onChangeText={setTotalAmount}
          keyboardType="numeric"
          placeholderTextColor={c.fgDim}
          style={styles.input}
        />

        <Text style={styles.label}>Notes internes</Text>
        <TextInput
          value={adminNotes}
          onChangeText={setAdminNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={c.fgDim}
          style={[styles.input, { minHeight: 80, textAlignVertical: 'top' }]}
        />

        <Pressable
          style={[styles.btnGold, { marginTop: spacing.md, opacity: updateMutation.isPending ? 0.6 : 1 }]}
          onPress={() => updateMutation.mutate()}
          disabled={updateMutation.isPending}
        >
          <Text style={styles.btnGoldText}>{updateMutation.isPending ? 'Enregistrement…' : 'Enregistrer'}</Text>
        </Pressable>
      </View>

      {/* PDF + envoi */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Document & envoi</Text>

        {(quote as any).has_pdf ? (
          <View style={[styles.pdfBanner, { borderColor: 'rgba(212,175,55,0.4)' }]}>
            <Ionicons name="document-text" size={20} color={c.goldText} />
            <Text style={{ color: c.fg, flex: 1, marginLeft: spacing.sm }}>PDF prêt — {quote.reference}.pdf</Text>
          </View>
        ) : (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small, marginBottom: spacing.sm }}>Aucun PDF généré.</Text>
        )}

        <Pressable
          style={[styles.btnGhost, { marginTop: spacing.sm }]}
          onPress={() => generatePdfMutation.mutate()}
          disabled={generatePdfMutation.isPending}
        >
          <Text style={styles.btnGhostText}>
            {generatePdfMutation.isPending ? 'Génération…' : ((quote as any).has_pdf ? 'Régénérer le PDF' : 'Générer le PDF')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.btnGold, { marginTop: spacing.sm }]}
          onPress={() => Alert.alert(
            'Envoyer au client ?',
            `Email à ${quote.client_email} avec le devis en pièce jointe.`,
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Envoyer', onPress: () => sendMutation.mutate() },
            ]
          )}
          disabled={sendMutation.isPending}
        >
          <Text style={styles.btnGoldText}>{sendMutation.isPending ? 'Envoi…' : '✉ Envoyer au client'}</Text>
        </Pressable>

        {quote.sent_at && (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.caption, textAlign: 'center', marginTop: spacing.sm }}>
            Envoyé le {new Date(quote.sent_at).toLocaleString('fr-FR')}
          </Text>
        )}
      </View>

      {/* WhatsApp client */}
      {whatsappLink && (
        <Pressable
          style={styles.whatsappBtn}
          onPress={() => Linking.openURL(whatsappLink)}
        >
          <Ionicons name="logo-whatsapp" size={20} color={c.whatsapp} />
          <Text style={{ color: c.fg, marginLeft: spacing.sm }}>Contacter sur WhatsApp</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

function Row({ label, value, c, last }: { label: string; value: string; c: ThemeColors; last?: boolean }) {
  return (
    <View style={{ paddingVertical: 8, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.lineSoft }}>
      <Text style={{ color: c.goldText, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '600' }}>{label}</Text>
      <Text style={{ color: c.fg, fontSize: fontSize.body, marginTop: 2 }}>{value}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  ref: { color: c.goldText, fontFamily: 'monospace', fontSize: fontSize.small, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, fontWeight: '300' as const, marginTop: spacing.xs },
  contact: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 4 },

  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginBottom: spacing.sm },

  label: { color: c.fgMuted, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: c.line, backgroundColor: 'rgba(10,8,6,0.5)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 10, color: c.fg, fontSize: fontSize.body, marginBottom: spacing.md },

  statusPill: { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
  statusPillText: { color: c.fgMuted, fontSize: 12 },

  pdfBanner: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: spacing.sm, borderWidth: 1, borderRadius: radius.sm, backgroundColor: 'rgba(212,175,55,0.06)' },

  btnGold: { backgroundColor: c.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },
  btnGhost: { borderWidth: 1, borderColor: c.line, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGhostText: { color: c.fg, fontSize: fontSize.body },

  whatsappBtn: { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const, marginTop: spacing.md, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.06)', borderRadius: radius.pill },
});
