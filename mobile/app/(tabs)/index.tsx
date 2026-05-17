import { ScrollView, Text, View, Pressable, Image, Linking, ImageBackground, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchProjects, fetchCategories, fetchPublicSettings } from '@/src/api/endpoints';
import { useAuthStore } from '@/src/store/auth';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';
import { CategoryBadge } from '@/src/components/CategoryBadge';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_HEIGHT = Math.max(560, SCREEN_W * 1.25);

const fetchFeatured = () => fetchProjects({ featured: 1, per_page: 6 });

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  'peinture': 'brush-outline',
  'peinture-fresques': 'brush-outline',
  'plafonnage': 'sparkles-outline',
  'carrelage': 'grid-outline',
  'mosaique': 'grid-outline',
  'decoration': 'flower-outline',
  'sur-mesure': 'cut-outline',
};

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
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Hero full-bleed */}
      <ImageBackground
        source={require('@/assets/images/bg-atmosphere.jpg')}
        style={styles.hero}
        imageStyle={{ opacity: 0.55 }}
      >
        <LinearGradient
          colors={['rgba(7,6,10,0.35)', 'rgba(7,6,10,0.65)', 'rgba(7,6,10,1)']}
          locations={[0, 0.55, 1]}
          style={styles.heroOverlay}
        />

        {/* Logo halo */}
        <View style={styles.heroTopRow}>
          <View style={styles.logoHalo}>
            <Image source={require('@/assets/lartiska-logo.jpg')} style={styles.logoImg} />
          </View>
          <Text style={styles.wordmark}>Lartis<Text style={{ fontStyle: 'italic', color: c.gold }}>Ka</Text></Text>
        </View>

        {/* Hero text */}
        <View style={styles.heroInner}>
          <Text style={styles.eyebrow}>— Lartiska · Sénégal · Gambie · Mauritanie</Text>
          <Text style={styles.heroTitle}>
            L'art qui transforme{'\n'}
            <Text style={styles.heroTitleEm}>vos espaces.</Text>
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
      </ImageBackground>

      {/* Essence */}
      <View style={styles.section}>
        <View style={styles.essenceBlock}>
          <Text style={styles.eyebrow}>— Notre essence</Text>
          <Text style={styles.sectionTitle}>
            Une explosion de <Text style={styles.italicGold}>couleur</Text>{'\n'}dans chaque pièce.
          </Text>
          <Text style={styles.lead}>
            Chez Lartiska, chaque mur, chaque plafond, chaque carreau devient une toile. Nous transformons vos espaces avec des matières, des teintes et des finitions pensées comme une œuvre d'art.
          </Text>
        </View>
      </View>

      {/* Services */}
      <View style={styles.sectionBorder}>
        <Text style={styles.eyebrowDeco}>✦ Nos services ✦</Text>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
          L'<Text style={styles.italicGold}>excellence</Text> dans chaque finition.
        </Text>

        {/* Art frame teaser */}
        <View style={styles.artFrame}>
          <Image source={require('@/assets/images/lartiska-emerald-salon.jpg')} style={styles.artFrameImg} />
          <View style={styles.artFrameCaption}>
            <Text style={styles.artFrameCaptionText}>émeraude · or · pièce signature</Text>
          </View>
        </View>

        <View style={styles.servicesGrid}>
          {(categories ?? []).slice(0, 4).map((cat) => (
            <View key={cat.id} style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Ionicons
                  name={CATEGORY_ICON[cat.slug] ?? 'sparkles-outline'}
                  size={20}
                  color={c.goldText}
                />
              </View>
              <Text style={styles.serviceTitle}>{cat.name}</Text>
              {cat.description && (
                <Text style={styles.serviceDesc} numberOfLines={3}>{cat.description}</Text>
              )}
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
        <Text style={styles.sectionTitle}>
          Nos <Text style={styles.italicGold}>réalisations</Text>{'\n'}à travers l'Afrique de l'Ouest.
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.lg }}
          style={{ marginTop: spacing.lg, marginHorizontal: -spacing.lg, paddingLeft: spacing.lg }}
        >
          {projects.map((p) => (
            <Pressable
              key={p.id}
              style={styles.projectCard}
              onPress={() => router.push(`/project/${p.slug}`)}
            >
              {p.cover_image && (
                <Image source={{ uri: p.cover_image }} style={styles.projectImg} />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(7,6,10,0.92)']}
                locations={[0.4, 1]}
                style={styles.projectGradient}
              />
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

      {/* WhatsApp CTA */}
      <View style={styles.section}>
        <Pressable
          style={styles.whatsappCard}
          onPress={() => Linking.openURL(`https://wa.me/${primaryWhatsapp}`)}
        >
          <View style={styles.whatsappIcon}>
            <Ionicons name="logo-whatsapp" size={26} color={c.whatsapp} />
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.whatsappTitle}>WhatsApp direct</Text>
            <Text style={styles.whatsappLead}>Discutons de votre projet en quelques messages.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={c.fgMuted} />
        </Pressable>
      </View>

      {/* Final CTA */}
      {!isAdmin && (
        <View style={[styles.section, { alignItems: 'center' }]}>
          <Text style={styles.eyebrowDeco}>✦ Prêt à commencer ✦</Text>
          <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>
            Discutons de votre projet.{'\n'}<Text style={styles.italicGold}>Devis offert sous 48h.</Text>
          </Text>
          <Pressable
            style={[styles.btnGold, { marginTop: spacing.xl }]}
            onPress={() => router.push('/(tabs)/devis')}
          >
            <Text style={styles.btnGoldText}>Lancer mon devis</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },

  hero: {
    height: HERO_HEIGHT,
    backgroundColor: c.ink,
    position: 'relative' as const,
    paddingTop: 56,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between' as const,
  },
  heroOverlay: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },
  heroTopRow: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: spacing.sm, zIndex: 2 },
  logoHalo: {
    width: 40, height: 40, borderRadius: 20, overflow: 'hidden' as const,
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.5)',
    shadowColor: '#D4AF37', shadowOpacity: 0.45, shadowRadius: 12, shadowOffset: { width: 0, height: 0 },
  },
  logoImg: { width: '100%' as const, height: '100%' as const, resizeMode: 'cover' as const },
  wordmark: { color: '#F4ECD8', fontSize: 18, fontFamily: 'serif', fontWeight: '500' as const, letterSpacing: 0.5 },

  heroInner: { zIndex: 2 },
  eyebrow: {
    color: c.gold,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    marginBottom: spacing.md,
    fontWeight: '600' as const,
  },
  heroTitle: {
    color: '#F4ECD8',
    fontSize: 42,
    fontFamily: 'serif',
    lineHeight: 48,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
  },
  heroTitleEm: { color: c.gold, fontStyle: 'italic' as const, fontWeight: '300' as const },
  heroLead: {
    color: 'rgba(244,236,216,0.85)',
    fontSize: fontSize.body,
    lineHeight: 24,
    marginTop: spacing.lg,
    maxWidth: 360,
  },
  heroCtas: { flexDirection: 'row' as const, gap: spacing.sm, marginTop: spacing.xl, flexWrap: 'wrap' as const },

  btnGold: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: spacing.xs,
    backgroundColor: c.gold,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  btnGoldText: { color: '#0A0806', fontSize: fontSize.small, fontWeight: '700' as const, letterSpacing: 0.5 },
  btnGhost: {
    borderWidth: 1,
    borderColor: 'rgba(244,236,216,0.4)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
  },
  btnGhostText: { color: '#F4ECD8', fontSize: fontSize.small, fontWeight: '500' as const },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  sectionBorder: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    marginTop: spacing.xxl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: c.line,
  },
  sectionHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  sectionTitle: {
    color: c.fg,
    fontFamily: 'serif',
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '300' as const,
    letterSpacing: -0.5,
    marginTop: spacing.sm,
  },
  italicGold: { color: c.goldText, fontStyle: 'italic' as const, fontWeight: '300' as const },
  lead: { color: c.fgMuted, fontSize: fontSize.body, lineHeight: 26, marginTop: spacing.md },

  essenceBlock: {
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(212,175,55,0.4)',
    paddingLeft: spacing.lg,
  },

  eyebrowDeco: {
    color: c.goldText,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    textAlign: 'center' as const,
    marginBottom: spacing.sm,
    fontWeight: '600' as const,
  },

  artFrame: {
    marginTop: spacing.xl,
    aspectRatio: 16 / 10,
    borderRadius: radius.md,
    overflow: 'hidden' as const,
    borderWidth: 1,
    borderColor: c.line,
    position: 'relative' as const,
    backgroundColor: c.inkSoft,
  },
  artFrameImg: { width: '100%' as const, height: '100%' as const },
  artFrameCaption: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: 'rgba(7,6,10,0.7)',
  },
  artFrameCaptionText: {
    color: '#E8C547',
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
    textAlign: 'center' as const,
  },

  servicesGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  serviceCard: {
    width: '48%' as const,
    backgroundColor: c.surface,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212,175,55,0.15)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.sm,
  },
  serviceTitle: {
    color: c.fg,
    fontSize: fontSize.body,
    fontFamily: 'serif',
    marginBottom: spacing.xs,
    fontWeight: '500' as const,
  },
  serviceDesc: { color: c.fgMuted, fontSize: fontSize.caption, lineHeight: 18 },

  linkSmall: {
    color: c.goldText,
    fontSize: fontSize.caption,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },

  projectCard: {
    width: 220,
    height: 280,
    marginRight: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden' as const,
    backgroundColor: c.inkSoft,
    borderColor: c.line,
    borderWidth: 1,
  },
  projectImg: {
    width: '100%' as const,
    height: '100%' as const,
    position: 'absolute' as const,
  },
  projectGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%' as const,
  },
  projectMeta: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.md,
  },
  projectCity: {
    color: c.gold,
    fontSize: 10,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  projectTitle: {
    color: '#F4ECD8',
    fontFamily: 'serif',
    fontSize: 18,
    marginTop: spacing.xs,
    lineHeight: 22,
    fontWeight: '400' as const,
  },

  whatsappCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: 'rgba(37,211,102,0.3)',
    backgroundColor: 'rgba(37,211,102,0.08)',
  },
  whatsappIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(37,211,102,0.18)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  whatsappTitle: { color: c.fg, fontSize: fontSize.body, fontWeight: '600' as const },
  whatsappLead: { color: c.fgMuted, fontSize: fontSize.small, marginTop: 2 },
});
