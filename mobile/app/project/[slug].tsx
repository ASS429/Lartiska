import { useState } from 'react';
import { Modal, ScrollView, Text, View, Image, Pressable, Linking, Share, Dimensions, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchProject } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';
import { CategoryBadge } from '@/src/components/CategoryBadge';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function ProjectDetailScreen() {
  const { styles, c } = useStyles(makeStyles);
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [lightbox, setLightbox] = useState<number | null>(null);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject(slug!),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Chargement…</Text>
      </View>
    );
  }
  if (!project) {
    return (
      <View style={styles.screen}>
        <Text style={styles.muted}>Projet introuvable.</Text>
      </View>
    );
  }

  const images = project.images ?? [];
  const heroUri = project.cover_image || images[0]?.url;
  const galleryImages = images.filter((img) => img.url !== heroUri);

  // Split title in two for italic gold accent on the last word
  const titleParts = (() => {
    const words = (project.title ?? '').trim().split(/\s+/);
    if (words.length <= 1) return { head: project.title ?? '', tail: '' };
    return { head: words.slice(0, -1).join(' '), tail: words[words.length - 1] };
  })();

  const onShareWhatsApp = () => {
    const text = `J'ai vu cette réalisation Lartiska : « ${project.title} »${project.city ? ` à ${project.city}` : ''}. https://lartiska.onrender.com/portfolio/${project.slug}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };
  const onShareNative = () =>
    Share.share({ message: `${project.title} — Lartiska — https://lartiska.onrender.com/portfolio/${project.slug}` });

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero 4:5 avec overlay info */}
        <View style={styles.heroWrap}>
          {heroUri && <Image source={{ uri: heroUri }} style={styles.heroImg} />}
          <LinearGradient
            colors={['rgba(7,6,10,0.55)', 'transparent', 'rgba(7,6,10,0.95)']}
            locations={[0, 0.4, 1]}
            style={styles.heroOverlay}
          />

          {/* Top row : back + photo count */}
          <View style={styles.heroTop}>
            <Pressable style={styles.iconBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="#F4ECD8" />
            </Pressable>
            {images.length > 0 && (
              <View style={styles.photoCount}>
                <Ionicons name="images-outline" size={14} color="#E8C547" />
                <Text style={styles.photoCountText}>{images.length} photo{images.length > 1 ? 's' : ''}</Text>
              </View>
            )}
          </View>

          {/* CatTag */}
          {project.category?.slug && (
            <View style={styles.heroCat}>
              <CategoryBadge slug={project.category.slug} label={project.category.name} />
            </View>
          )}

          {/* Hero info anchor bas */}
          <View style={styles.heroInfo}>
            {project.city && (
              <Text style={styles.heroCity}>{project.city}</Text>
            )}
            <Text style={styles.heroTitle}>
              {titleParts.head}
              {titleParts.tail ? <>{' '}<Text style={styles.italicGold}>{titleParts.tail}</Text></> : null}
            </Text>
          </View>
        </View>

        {/* Description */}
        {project.description && (
          <View style={styles.section}>
            <Text style={styles.desc}>{project.description}</Text>
          </View>
        )}

        {/* Photo grid 1:1 2-col */}
        {galleryImages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.eyebrow}>— Galerie</Text>
            <View style={styles.photoGrid}>
              {galleryImages.map((img, i) => (
                <Pressable
                  key={img.id}
                  style={styles.photoTile}
                  onPress={() => setLightbox(i + 1)}
                >
                  <Image source={{ uri: img.url }} style={{ width: '100%', height: '100%' }} />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Metadata card */}
        <View style={styles.section}>
          <View style={styles.metaCard}>
            <Text style={styles.metaCardTitle}>Détails de l'œuvre</Text>
            {project.category?.name && (
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Catégorie</Text>
                <Text style={styles.metaVal}>{project.category.name}</Text>
              </View>
            )}
            {project.city && (
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Lieu</Text>
                <Text style={styles.metaVal}>{project.city}</Text>
              </View>
            )}
            <View style={[styles.metaRow, { borderBottomWidth: 0 }]}>
              <Text style={styles.metaKey}>Photos</Text>
              <Text style={styles.metaVal}>{images.length || 1}</Text>
            </View>
            <Pressable
              style={[styles.btnGold, { marginTop: spacing.md }]}
              onPress={() => router.push(project.category?.id ? `/(tabs)/devis?service_id=${project.category.id}` : '/(tabs)/devis')}
            >
              <Ionicons name="sparkles-outline" size={16} color={c.ink} />
              <Text style={styles.btnGoldText}>Lancer un projet similaire</Text>
            </Pressable>
          </View>
        </View>

        {/* Share actions */}
        <View style={styles.section}>
          <View style={styles.shareRow}>
            <Pressable style={styles.btnRow} onPress={onShareWhatsApp}>
              <Ionicons name="logo-whatsapp" size={20} color={c.whatsapp} />
              <Text style={styles.btnRowText}>WhatsApp</Text>
            </Pressable>
            <Pressable style={styles.btnRow} onPress={onShareNative}>
              <Ionicons name="share-social-outline" size={18} color={c.fg} />
              <Text style={styles.btnRowText}>Partager</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Lightbox */}
      {lightbox !== null && heroUri && (
        <Lightbox
          uris={[heroUri, ...galleryImages.map((g) => g.url)]}
          captions={[project.title, ...galleryImages.map(() => project.title)]}
          startIndex={lightbox}
          onClose={() => setLightbox(null)}
          c={c}
        />
      )}
    </View>
  );
}

function Lightbox({
  uris,
  captions,
  startIndex,
  onClose,
  c,
}: {
  uris: string[];
  captions: string[];
  startIndex: number;
  onClose: () => void;
  c: ThemeColors;
}) {
  const [idx, setIdx] = useState(startIndex);
  const total = uris.length;

  return (
    <Modal visible animationType="fade" transparent onRequestClose={onClose}>
      <View style={lbStyles.backdrop}>
        {/* Top bar */}
        <View style={lbStyles.topBar}>
          <Text style={lbStyles.counter}>
            {String(idx + 1).padStart(2, '0')}
            <Text style={{ color: 'rgba(244,236,216,0.5)' }}> / {String(total).padStart(2, '0')}</Text>
          </Text>
          <Pressable style={lbStyles.iconBtn} onPress={onClose}>
            <Ionicons name="close" size={22} color="#F4ECD8" />
          </Pressable>
        </View>

        {/* Main image */}
        <View style={lbStyles.imageWrap}>
          <Image source={{ uri: uris[idx] }} style={lbStyles.mainImage} resizeMode="contain" />

          {idx > 0 && (
            <Pressable style={[lbStyles.navBtn, { left: 12 }]} onPress={() => setIdx(idx - 1)}>
              <Ionicons name="chevron-back" size={26} color="#F4ECD8" />
            </Pressable>
          )}
          {idx < total - 1 && (
            <Pressable style={[lbStyles.navBtn, { right: 12 }]} onPress={() => setIdx(idx + 1)}>
              <Ionicons name="chevron-forward" size={26} color="#F4ECD8" />
            </Pressable>
          )}
        </View>

        {/* Caption */}
        {captions[idx] && (
          <Text style={lbStyles.caption}>« {captions[idx]} »</Text>
        )}

        {/* Thumbnail strip */}
        <View style={lbStyles.thumbStrip}>
          <FlatList
            horizontal
            data={uris}
            keyExtractor={(_, i) => String(i)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, paddingHorizontal: spacing.md }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => setIdx(index)}
                style={[
                  lbStyles.thumb,
                  index === idx && { borderColor: c.gold, opacity: 1 },
                ]}
              >
                <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} />
              </Pressable>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  muted: { color: c.fgMuted, padding: spacing.xl, textAlign: 'center' as const },

  heroWrap: {
    width: '100%' as const,
    aspectRatio: 4 / 5,
    backgroundColor: c.ink,
    position: 'relative' as const,
  },
  heroImg: { width: '100%' as const, height: '100%' as const, position: 'absolute' as const },
  heroOverlay: { position: 'absolute' as const, top: 0, left: 0, right: 0, bottom: 0 },

  heroTop: {
    position: 'absolute' as const,
    top: 56,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(7,6,10,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(244,236,216,0.18)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  photoCount: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(7,6,10,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  photoCountText: {
    color: '#E8C547',
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    fontWeight: '700' as const,
  },

  heroCat: { position: 'absolute' as const, top: 110, left: spacing.md },

  heroInfo: {
    position: 'absolute' as const,
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  heroCity: {
    color: '#E8C547',
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '700' as const,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    color: '#F4ECD8',
    fontFamily: 'serif',
    fontSize: 34,
    fontWeight: '300' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  italicGold: { color: c.gold, fontStyle: 'italic' as const, fontWeight: '300' as const },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  eyebrow: {
    color: c.goldText,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
    marginBottom: spacing.md,
  },
  desc: {
    color: c.fg,
    fontSize: fontSize.body,
    lineHeight: 26,
  },

  photoGrid: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: spacing.sm,
  },
  photoTile: {
    width: '48.5%' as const,
    aspectRatio: 1,
    borderRadius: radius.sm,
    overflow: 'hidden' as const,
    backgroundColor: c.inkSoft,
    borderWidth: 1,
    borderColor: c.line,
  },

  metaCard: {
    backgroundColor: c.surface,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.lg,
  },
  metaCardTitle: {
    color: c.goldText,
    fontSize: 11,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '700' as const,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: c.lineSoft,
  },
  metaKey: { color: c.fgMuted, fontSize: 13 },
  metaVal: { color: c.fg, fontSize: 14, fontWeight: '600' as const },

  btnGold: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: spacing.xs,
    backgroundColor: c.gold,
    paddingVertical: 14,
    borderRadius: radius.pill,
  },
  btnGoldText: { color: c.ink, fontSize: fontSize.body, fontWeight: '700' as const, letterSpacing: 0.3 },

  shareRow: { flexDirection: 'row' as const, gap: spacing.sm },
  btnRow: {
    flex: 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: c.line,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
  },
  btnRowText: { color: c.fg, fontSize: fontSize.small, fontWeight: '500' as const },
});

const lbStyles = {
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7,6,10,0.96)',
  },
  topBar: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    paddingTop: 56,
    paddingBottom: spacing.md,
  },
  counter: {
    color: '#E8C547',
    fontFamily: 'serif',
    fontSize: 22,
    fontWeight: '300' as const,
    letterSpacing: 2,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(244,236,216,0.08)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  imageWrap: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    position: 'relative' as const,
  },
  mainImage: { width: SCREEN_W, height: SCREEN_H * 0.6 },
  navBtn: {
    position: 'absolute' as const,
    top: '45%' as const,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(244,236,216,0.1)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  caption: {
    color: 'rgba(244,236,216,0.7)',
    fontFamily: 'serif',
    fontStyle: 'italic' as const,
    fontSize: 14,
    textAlign: 'center' as const,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  thumbStrip: {
    paddingBottom: 36,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: 'hidden' as const,
    borderWidth: 2,
    borderColor: 'transparent',
    opacity: 0.55,
  },
};
