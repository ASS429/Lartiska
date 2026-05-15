import { ScrollView, Text, View, Pressable, RefreshControl } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchAdminDashboard } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';

const STATUS_LABELS: Record<string, string> = {
  pending: 'En attente',
  processing: 'En cours',
  sent: 'Envoyé',
  accepted: 'Accepté',
  rejected: 'Refusé',
};

const ACTION_LABELS: Record<string, string> = {
  'quote.pdf_generated': 'PDF généré',
  'quote.sent_to_client': 'Devis envoyé au client',
  'quote.status_changed': 'Statut changé',
  'quote.client_accept': '✓ Client a accepté',
  'quote.client_reject': '✕ Client a refusé',
  'quote.client_request_changes': '↺ Modif demandée',
  'quotes.claimed_on_register': 'Devis récupérés',
};

export default function AdminScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { user, status } = useAuthStore();

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: fetchAdminDashboard,
    enabled: status === 'authenticated' && user?.role === 'admin',
  });

  if (status !== 'authenticated' || user?.role !== 'admin') {
    return (
      <View style={[styles.screen, styles.centerContent]}>
        <Text style={styles.eyebrow}>— Admin</Text>
        <Text style={styles.title}>Accès réservé</Text>
        <Text style={styles.lead}>Cette section est réservée à Tounkara.</Text>
        <Pressable style={styles.btnGold} onPress={() => router.push('/auth/login')}>
          <Text style={styles.btnGoldText}>Se connecter</Text>
        </Pressable>
      </View>
    );
  }

  if (isLoading || !data) {
    return <View style={[styles.screen, styles.centerContent]}><Text style={{ color: c.fgMuted }}>Chargement…</Text></View>;
  }

  const maxMonthly = Math.max(...(data.quotes_monthly?.map((m: any) => m.count) || [1]), 1);
  const maxTopService = Math.max(...(data.top_services?.map((s: any) => s.count) || [1]), 1);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={c.goldText} />}
    >
      <Text style={styles.eyebrow}>— Dashboard</Text>
      <Text style={styles.title}>Vue d'ensemble</Text>

      {/* KPI grid */}
      <View style={styles.kpiGrid}>
        <Kpi label="Ce mois" value={data.quotes.this_month} accent c={c} />
        <Kpi label="En attente" value={data.quotes.pending} c={c} />
        <Kpi label="Acceptation" value={`${data.quotes.acceptance_rate}%`} c={c} />
        <Kpi label="Msg non lus" value={data.messages.unread} c={c} />
      </View>

      {/* Graphe mensuel */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Demandes mensuelles</Text>
        <Text style={styles.cardSub}>6 derniers mois</Text>
        <View style={styles.chart}>
          {data.quotes_monthly.map((m: any) => {
            const totalH = (m.count / maxMonthly) * 110;
            const acceptedH = m.count > 0 ? (m.accepted / m.count) * totalH : 0;
            return (
              <View key={m.year_month} style={styles.chartCol}>
                <Text style={styles.chartCount}>{m.count}</Text>
                <View style={styles.chartBarWrap}>
                  <View style={[styles.chartBarTotal, { height: totalH }]} />
                  <View style={[styles.chartBarAccepted, { height: acceptedH }]} />
                </View>
                <Text style={styles.chartLabel}>{m.label}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legend}><View style={[styles.dot, { backgroundColor: c.gold }]} /><Text style={styles.legendTxt}>Acceptés</Text></View>
          <View style={styles.legend}><View style={[styles.dot, { backgroundColor: 'rgba(212,175,55,0.35)' }]} /><Text style={styles.legendTxt}>Total</Text></View>
        </View>
      </View>

      {/* Top services */}
      {data.top_services?.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top services</Text>
          {data.top_services.map((s: any) => (
            <View key={s.service_id} style={{ marginTop: spacing.sm }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: c.fg, fontSize: fontSize.small, flex: 1 }} numberOfLines={1}>{s.title}</Text>
                <Text style={{ color: c.goldText, fontWeight: '600', fontSize: fontSize.small }}>{s.count}</Text>
              </View>
              <View style={styles.serviceTrack}>
                <View style={[styles.serviceFill, { width: `${(s.count / maxTopService) * 100}%` }]} />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Recent quotes */}
      <View style={styles.card}>
        <View style={styles.cardHead}>
          <Text style={styles.cardTitle}>Derniers devis</Text>
          <Pressable onPress={() => router.push('/admin/quotes' as any)}>
            <Text style={styles.cardLink}>Tout voir →</Text>
          </Pressable>
        </View>
        {data.recent_quotes.length === 0 ? (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small, marginTop: spacing.sm }}>Aucun devis pour le moment.</Text>
        ) : (
          data.recent_quotes.map((q: any) => (
            <Pressable key={q.id} style={styles.rowItem} onPress={() => router.push(`/admin/quotes/${q.id}` as any)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowRef}>{q.reference}</Text>
                <Text style={styles.rowName}>{q.client_name}</Text>
                <Text style={styles.rowMeta}>{q.service?.title || '—'}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{STATUS_LABELS[q.status] || q.status}</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      {/* Activity */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activité récente</Text>
        {data.recent_activity?.length === 0 ? (
          <Text style={{ color: c.fgMuted, fontSize: fontSize.small, marginTop: spacing.sm }}>Aucune activité.</Text>
        ) : (
          data.recent_activity.slice(0, 6).map((a: any) => (
            <View key={a.id} style={styles.activityRow}>
              <View style={styles.activityDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.activityAction}>{ACTION_LABELS[a.action] || a.action}</Text>
                <Text style={styles.activityMeta}>
                  {a.user?.name || 'Système'} · {new Date(a.created_at).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}
                </Text>
              </View>
            </View>
          ))
        )}
      </View>

      <Text style={[styles.helpNote]}>
        💡 Gestion complète (projets, services, avis, réglages) disponible sur le site web admin.
      </Text>
    </ScrollView>
  );
}

function Kpi({ label, value, accent, c }: { label: string; value: any; accent?: boolean; c: ThemeColors }) {
  return (
    <View style={{
      width: '48%',
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: accent ? c.gold : c.line,
      backgroundColor: c.surface,
    }}>
      <Text style={{ color: c.fgMuted, fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: '600', marginBottom: 4 }}>{label}</Text>
      <Text style={{ color: accent ? c.goldText : c.fg, fontFamily: 'serif', fontSize: 30, fontWeight: '300' }}>{value}</Text>
    </View>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  content: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: 40 },
  centerContent: { justifyContent: 'center' as const, alignItems: 'center' as const, padding: spacing.xl },

  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  title: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300' as const, marginTop: spacing.xs, marginBottom: spacing.lg },
  lead: { color: c.fgMuted, fontSize: fontSize.body, textAlign: 'center' as const, marginVertical: spacing.lg },

  kpiGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm, marginBottom: spacing.lg },

  card: { backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  cardHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  cardTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.lg, fontWeight: '400' as const },
  cardSub: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 2, marginBottom: spacing.md },
  cardLink: { color: c.goldText, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  chart: { flexDirection: 'row' as const, alignItems: 'flex-end' as const, height: 140, gap: 6, marginTop: spacing.sm },
  chartCol: { flex: 1, alignItems: 'center' as const, justifyContent: 'flex-end' as const },
  chartCount: { color: c.fgMuted, fontSize: 10, marginBottom: 2 },
  chartBarWrap: { width: '100%' as const, height: 110, justifyContent: 'flex-end' as const, position: 'relative' as const },
  chartBarTotal: { backgroundColor: 'rgba(212,175,55,0.35)', borderTopLeftRadius: 3, borderTopRightRadius: 3, width: '100%' as const, position: 'absolute' as const, bottom: 0 },
  chartBarAccepted: { backgroundColor: c.gold, borderTopLeftRadius: 3, borderTopRightRadius: 3, width: '100%' as const, position: 'absolute' as const, bottom: 0 },
  chartLabel: { color: c.fgDim, fontSize: 10, letterSpacing: 1, textTransform: 'uppercase' as const, marginTop: 4 },

  legendRow: { flexDirection: 'row' as const, gap: spacing.md, marginTop: spacing.sm },
  legend: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 2 },
  legendTxt: { color: c.fgMuted, fontSize: 11 },

  serviceTrack: { height: 6, backgroundColor: 'rgba(212,175,55,0.15)', borderRadius: 3, overflow: 'hidden' as const },
  serviceFill: { height: '100%' as const, backgroundColor: c.gold },

  rowItem: { flexDirection: 'row' as const, alignItems: 'center' as const, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: c.lineSoft, gap: spacing.sm },
  rowRef: { color: c.goldText, fontSize: 11, fontFamily: 'monospace', fontWeight: '600' as const },
  rowName: { color: c.fg, fontSize: fontSize.body, marginTop: 2 },
  rowMeta: { color: c.fgMuted, fontSize: fontSize.caption, marginTop: 2 },
  statusBadge: { borderWidth: 1, borderColor: c.line, paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
  statusText: { color: c.fgMuted, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  activityRow: { flexDirection: 'row' as const, alignItems: 'flex-start' as const, paddingVertical: 8, gap: spacing.sm },
  activityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.gold, marginTop: 7 },
  activityAction: { color: c.fg, fontSize: fontSize.small },
  activityMeta: { color: c.fgDim, fontSize: 11, marginTop: 2 },

  btnGold: { backgroundColor: c.gold, paddingHorizontal: spacing.xl, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' as const },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '600' as const },

  helpNote: { color: c.fgDim, fontSize: fontSize.caption, fontStyle: 'italic' as const, textAlign: 'center' as const, marginTop: spacing.lg, paddingHorizontal: spacing.sm },
});
