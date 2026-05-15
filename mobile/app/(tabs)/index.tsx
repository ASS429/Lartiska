import { ScrollView, StyleSheet, Text, View, Pressable, Image, Linking } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchProjects, fetchCategories, fetchPublicSettings } from '@/src/api/endpoints';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

// Wrap fetchProjects pour featured only
const fetchFeatured = () => fetchProjects({ featured: 1, per_page: 6 });

export default function HomeScreen() {
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
          <Text style={{ color: colors.gold, fontStyle: 'italic' }}>vos espaces.</Text>
        </Text>
        <Text style={styles.heroLead}>
          Peinture, plafonnage, carrelage et décoration d'intérieur réunis dans une démarche artistique sur-mesure.
        </Text>
        <View style={styles.heroCtas}>
          <Pressable style={styles.btnGold} onPress={() => router.push('/(tabs)/devis')}>
            <Text style={styles.btnGoldText}>Demander un devis</Text>
          </Pressable>
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
          {(categories ?? []).slice(0, 4).map((c) => (
            <View key={c.id} style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Ionicons name="brush-outline" size={20} color={colors.gold} />
              </View>
              <Text style={styles.serviceTitle}>{c.name}</Text>
              {c.description && <Text style={styles.serviceDesc} numberOfLines={2}>{c.description}</Text>}
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
          <Ionicons name="logo-whatsapp" size={28} color={colors.whatsapp} />
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.whatsappTitle}>WhatsApp direct</Text>
            <Text style={styles.whatsappLead}>Discutons de votre projet en quelques messages.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.fgMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { paddingTop: 60, paddingBottom: 40 },
  hero: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase', marginBottom: spacing.md },
  eyebrowDeco: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase', textAlign: 'center', marginBottom: spacing.md },
  heroTitle: { color: colors.fg, fontSize: fontSize.hero, fontFamily: 'serif', lineHeight: 44, fontWeight: '300' },
  heroLead: { color: colors.fgMuted, fontSize: fontSize.body, lineHeight: 22, marginTop: spacing.lg },
  heroCtas: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl, flexWrap: 'wrap' },
  btnGold: { backgroundColor: colors.gold, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  btnGoldText: { color: colors.ink, fontSize: fontSize.small, fontWeight: '600', letterSpacing: 0.5 },
  btnGhost: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radius.pill },
  btnGhostText: { color: colors.fg, fontSize: fontSize.small, fontWeight: '500' },

  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xxl },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.xxl, lineHeight: 34, fontWeight: '300', marginTop: spacing.xs },
  linkSmall: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 2, textTransform: 'uppercase' },

  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.lg },
  serviceCard: { width: '48%', backgroundColor: colors.surface, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  serviceIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(212,175,55,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm },
  serviceTitle: { color: colors.fg, fontSize: fontSize.body, fontFamily: 'serif', marginBottom: spacing.xs },
  serviceDesc: { color: colors.fgMuted, fontSize: fontSize.caption, lineHeight: 16 },

  projectCard: { width: 220, height: 280, marginRight: spacing.md, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.ink, borderColor: colors.line, borderWidth: 1 },
  projectImg: { width: '100%', height: '100%', position: 'absolute' },
  projectMeta: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.md, backgroundColor: 'rgba(7,6,10,0.85)' },
  projectCity: { color: colors.gold, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase' },
  projectTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.lg, marginTop: spacing.xs, lineHeight: 22 },

  whatsappCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: 'rgba(37,211,102,0.3)', backgroundColor: 'rgba(37,211,102,0.08)' },
  whatsappTitle: { color: colors.fg, fontSize: fontSize.body, fontWeight: '600' },
  whatsappLead: { color: colors.fgMuted, fontSize: fontSize.small, marginTop: 2 },
});
