import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Pressable, Linking, Share, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchProject } from '@/src/api/endpoints';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export default function ProjectDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [imgIdx, setImgIdx] = useState(0);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: () => fetchProject(slug!),
    enabled: !!slug,
  });

  if (isLoading) return <View style={styles.screen}><Text style={styles.muted}>Chargement…</Text></View>;
  if (!project) return <View style={styles.screen}><Text style={styles.muted}>Projet introuvable.</Text></View>;

  const images = project.images || [];
  const onShareWhatsApp = () => {
    const text = `J'ai vu cette réalisation Lartiska : « ${project.title} »${project.city ? ` à ${project.city}` : ''}. https://lartiska.onrender.com/portfolio/${project.slug}`;
    Linking.openURL(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };
  const onShareNative = () => Share.share({ message: `${project.title} — Lartiska — https://lartiska.onrender.com/portfolio/${project.slug}` });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Cover */}
      {project.cover_image && (
        <Image source={{ uri: images[imgIdx]?.url || project.cover_image }} style={styles.cover} />
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbs} contentContainerStyle={{ padding: spacing.md, gap: spacing.xs }}>
          {images.map((img, i) => (
            <Pressable
              key={img.id}
              onPress={() => setImgIdx(i)}
              style={[styles.thumb, i === imgIdx && { borderColor: colors.gold }]}
            >
              <Image source={{ uri: img.url }} style={{ width: '100%', height: '100%' }} />
            </Pressable>
          ))}
        </ScrollView>
      )}

      <View style={styles.body}>
        <Text style={styles.eyebrow}>{project.category?.name}{project.city ? ` · ${project.city}` : ''}</Text>
        <Text style={styles.title}>{project.title}</Text>
        {project.description && <Text style={styles.desc}>{project.description}</Text>}

        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={styles.btnGold}
            onPress={() => router.push(project.category?.id ? `/(tabs)/devis?service_id=${project.category.id}` : '/(tabs)/devis')}
          >
            <Text style={styles.btnGoldText}>✦ Je veux pareil</Text>
          </Pressable>
          <Pressable style={styles.btnRow} onPress={onShareWhatsApp}>
            <Ionicons name="logo-whatsapp" size={20} color={colors.whatsapp} />
            <Text style={styles.btnRowText}>Partager sur WhatsApp</Text>
          </Pressable>
          <Pressable style={styles.btnRow} onPress={onShareNative}>
            <Ionicons name="share-social-outline" size={20} color={colors.fg} />
            <Text style={styles.btnRowText}>Partage natif…</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  cover: { width, height: width * 1.1, backgroundColor: colors.ink },
  thumbs: { backgroundColor: colors.ink, borderBottomWidth: 1, borderBottomColor: colors.line },
  thumb: { width: 60, height: 60, borderRadius: 8, overflow: 'hidden', borderWidth: 2, borderColor: 'transparent' },
  body: { padding: spacing.lg },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300', lineHeight: 42, marginTop: spacing.sm },
  desc: { color: colors.fgMuted, fontSize: fontSize.body, lineHeight: 22, marginTop: spacing.md },
  actions: { gap: spacing.sm, marginTop: spacing.xl },
  btnGold: { backgroundColor: colors.gold, paddingVertical: 14, borderRadius: radius.pill, alignItems: 'center' },
  btnGoldText: { color: colors.ink, fontSize: fontSize.body, fontWeight: '600' },
  btnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.line, paddingVertical: 14, paddingHorizontal: spacing.md, borderRadius: radius.pill, justifyContent: 'center' },
  btnRowText: { color: colors.fg, fontSize: fontSize.body },
  muted: { color: colors.fgMuted, padding: spacing.xl, textAlign: 'center' },
});
