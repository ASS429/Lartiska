import { ScrollView, Text, View, Pressable, Image, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchProjects, fetchCategories, fetchPublicSettings } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';
import { CategoryBadge } from '@/src/components/CategoryBadge';

// Wrap fetchProjects pour featured only
const fetchFeatured = () => fetchProjects({ featured: 1, per_page: 6 });

export default function HomeScreen() {
  const { styles, c } = useStyles(makeStyles);
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');
  const { data: featured } = useQuery({ queryKey: ['featured'], queryFn: fetchFeatured });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: fetchPublicSettings });

  const projects = featured?.data ?? [];
  const phones = settings?.['contact.phones'] ?? [];
  const primaryWhatsapp = phones[0]?.whatsapp ?? '221785446363';

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>— Lartiska · Sénégal · Gambie · Mauritanie</Text>
        <Text style={styles.heroTitle}>
          L'art qui transforme{'\n'}
          <Text style={{ color: c.gold, fontStyle: 'italic' }}>vos espaces.</Text>
        </Text>
        <Text style={styles.heroLead}>
          Peinture, plafonnage, carrelage et décoration d'intérieur réunis dans une démarche artistique sur-mesure.
        </Text>
        <View style={styles.heroCtas}>
          {isAdmin ? (
            <Pressable style={styles.btnGold} onPress={() => router.push('/(tabs)/admin')}>
              <Ionicons name="briefcase-outline" size={18} color={c.ink} />
              <Text style={styles.btnGoldText}>Accéder à l'admin</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.btnGold} onPress={() => router.push('/(tabs)/devis')}>
              <Text style={styles.btnGoldText}>Demander un devis</Text>
            </Pressable>
          )}
          <Pressable style={styles.btnGhost} onPress={() => router.push('/(tabs)/portfolio')}>
            <Text style={styles.btnGhostText}>Voir le portfolio →</Text>
          </Pressable>
        </View>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.eyebrowDeco}>✦ Nos services ✦</Text>
        <Text style={styles.sectionTitle}>L'excellence dans chaque finition.</Text>
        <View style={styles.servicesGrid}>
          {(categories ?? []).slice(0, 4).map((cat) => (
            <View key={cat.id} style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Ionicons name="brush-outline" size={20} color={c.gold} />
              </View>
              <Text style={styles.serviceTitle}>{cat.name}</Text>
              {cat.description && <Text style={styles.serviceDesc} numberOfLines={2}>{cat.description}</Text>}
            </View>
          ))}
        </View>
      </View>

      {/* Portfolio teaser */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.eyebrow}>— Portfolio</Text>
          <Pressable onPress={() => router.push('/(tabs)/portfolio')}>
            <Text style={styles.linkSmall}>Tout voir →</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionTitle}>Nos réalisations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: spacing.lg }}>
          {projects.map((p) => (
            <Pressable
              key={p.id}
              style={styles.projectCard}
              onPress={() => router.push(`/project/${p.slug}`)}
            >
              {p.cover_image && (
                <Image source={{ uri: p.cover_image }} style={styles.projectImg} />
              )}
              {p.category?.slug && (
                <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }}>
                  <CategoryBadge slug={p.category.slug} label={p.category.name} />
                </View>
              )}
              <View style={styles.projectMeta}>
                <Text style={styles.projectCity}>{p.city || p.category?.name}</Text>
                <Text style={styles.projectTitle} numberOfLines={2}>{p.title}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* CTA WhatsApp */}
      <View style={styles.section}>
        <Pressable
          style={styles.whatsappCard}
          onPress={() => Linking.openURL(`https://wa.me/${primaryWhatsapp}`)}
        >
          <Ionicons name="logo-whatsapp" size={28} color={c.whatsapp} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.whatsappTitle}>WhatsApp direct</Text>
            <Text style={styles.whatsappLead}>Discutons de votre projet en quelques messages.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.fgMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  content: { paddingTop: 60, paddingBottom: 40 },
  hero: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  eyebrow: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, marginBottom: spacing.md },
  eyebrowDeco: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' as const, textAlign: 'center' as const, marginBottom: spacing.md },
  heroTitle: { color: c.fg, fontSize: fontSize.hero, fontFamily: 'serif', lineHeight: 46, fontWeight: '300' as const },
  heroLead: { color: c.fgMuted, fontSize: fontSize.body, lineHeight: 24, marginTop: spacing.lg },
  heroCtas: { flexDirection: 'row' as const, gap: spacing.sm, marginTop: spacing.xl, flexWrap: 'wrap' as const },
  btnGold: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.xs, backgroundColor: c.gold, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  btnGoldText: { color: c.ink, fontSize: fontSize.small, fontWeight: '700' as const, letterSpacing: 0.5 },
  btnGhost: { borderWidth: 1, borderColor: c.line, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  btnGhostText: { color: c.fg, fontSize: fontSize.small, fontWeight: '500' as const },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  sectionHead: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  sectionTitle: { color: c.fg, fontFamily: 'serif', fontSize: fontSize.xxl, lineHeight: 36, fontWeight: '300' as const, marginTop: spacing.xs },
  linkSmall: { color: c.goldText, fontSize: fontSize.caption, letterSpacing: 2, textTransform: 'uppercase' as const, fontWeight: '600' as const },

  servicesGrid: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, gap: spacing.sm, marginTop: spacing.lg },
  serviceCard: { width: '48%' as const, backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  serviceIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(212,175,55,0.15)', justifyContent: 'center' as const, alignItems: 'center' as const, marginBottom: spacing.sm },
  serviceTitle: { color: c.fg, fontSize: fontSize.body, fontFamily: 'serif', marginBottom: spacing.xs },
  serviceDesc: { color: c.fgMuted, fontSize: fontSize.caption, lineHeight: 18 },

  projectCard: { width: 220, height: 280, marginRight: spacing.md, borderRadius: radius.md, overflow: 'hidden' as const, backgroundColor: c.inkSoft, borderColor: c.line, borderWidth: 1 },
  projectImg: { width: '100%' as const, height: '100%' as const, position: 'absolute' as const },
  projectMeta: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, padding: spacing.md, backgroundColor: 'rgba(7,6,10,0.88)' },
  projectCity: { color: c.gold, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' as const, fontWeight: '600' as const },
  projectTitle: { color: '#F4ECD8', fontFamily: 'serif', fontSize: fontSize.lg, marginTop: spacing.xs, lineHeight: 24 },

  whatsappCard: { flexDirection: 'row' as const, alignItems: 'center' as const, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.08)' },
  whatsappTitle: { color: c.fg, fontSize: fontSize.body, fontWeight: '600' as const },
  whatsappLead: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 2 },
});
