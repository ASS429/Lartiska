import { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchProjects, fetchCategories, fetchProjectCities } from '@/src/api/endpoints';
import { spacing, fontSize, radius, type ThemeColors } from '@/constants/theme';
import { useStyles } from '@/src/hooks/useStyles';
import { CategoryBadge } from '@/src/components/CategoryBadge';

export default function PortfolioScreen() {
  const { styles, c } = useStyles(makeStyles);
  const [category, setCategory] = useState<string>('all');
  const [city, setCity] = useState<string>('all');

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: cities } = useQuery({ queryKey: ['cities'], queryFn: fetchProjectCities });

  const { data, isLoading } = useQuery({
    queryKey: ['portfolio', category, city],
    queryFn: () => fetchProjects({
      ...(category !== 'all' ? { category } : {}),
      ...(city !== 'all' ? { city } : {}),
      per_page: 30,
    }),
  });

  const projects = data?.data ?? [];

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>— Portfolio</Text>
        <Text style={styles.title}>
          Œuvres <Text style={styles.italicGold}>récentes.</Text>
        </Text>
        <Text style={styles.lead}>
          Du Sénégal à la Mauritanie — chaque chantier est l'occasion de redéfinir un espace.
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: spacing.lg }}
          style={[styles.filters, { marginHorizontal: -spacing.lg, paddingLeft: spacing.lg }]}
        >
          <Pill label="Toutes" active={category === 'all'} onPress={() => setCategory('all')} c={c} />
          {(categories ?? []).map((cat) => (
            <Pill key={cat.id} label={cat.name} active={category === cat.slug} onPress={() => setCategory(cat.slug)} c={c} />
          ))}
        </ScrollView>

        {(cities?.length ?? 0) > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: spacing.lg }}
            style={[styles.filters, { marginTop: 8, marginHorizontal: -spacing.lg, paddingLeft: spacing.lg }]}
          >
            <Pill label="Toutes villes" active={city === 'all'} onPress={() => setCity('all')} c={c} />
            {(cities ?? []).map((cy) => (
              <Pill key={cy} label={cy} active={city === cy} onPress={() => setCity(cy)} c={c} />
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={projects}
        keyExtractor={(p) => String(p.id)}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={{ gap: spacing.sm }}
        ListEmptyComponent={
          <Text style={{ color: c.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>
            {isLoading ? 'Chargement…' : 'Aucune réalisation pour ces filtres.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/project/${item.slug}`)}>
            {item.cover_image && <Image source={{ uri: item.cover_image }} style={styles.cardImg} />}
            <LinearGradient
              colors={['transparent', 'rgba(7,6,10,0.92)']}
              locations={[0.45, 1]}
              style={styles.cardGradient}
            />
            {item.category?.slug && (
              <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 3 }}>
                <CategoryBadge slug={item.category.slug} label={item.category.name} />
              </View>
            )}
            <View style={styles.cardOverlay}>
              <Text style={styles.cardCity}>{item.city || item.category?.name}</Text>
              <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

function Pill({ label, active, onPress, c }: { label: string; active: boolean; onPress: () => void; c: ThemeColors }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        { paddingHorizontal: spacing.md, paddingVertical: 7, borderRadius: radius.pill, borderWidth: 1, borderColor: c.line, marginRight: spacing.xs },
        active && { borderColor: c.gold, backgroundColor: 'rgba(212,175,55,0.12)' },
      ]}
    >
      <Text style={[
        { color: c.fgMuted, fontSize: 11, letterSpacing: 1.8, textTransform: 'uppercase', fontWeight: '600' },
        active && { color: c.goldText, fontWeight: '700' },
      ]}>{label}</Text>
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) => ({
  screen: { flex: 1, backgroundColor: c.bg },
  header: {
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  eyebrow: {
    color: c.gold,
    fontSize: fontSize.caption,
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
    marginBottom: spacing.xs,
  },
  title: {
    color: c.fg,
    fontFamily: 'serif',
    fontSize: 40,
    fontWeight: '300' as const,
    marginTop: spacing.xs,
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  italicGold: { color: c.goldText, fontStyle: 'italic' as const, fontWeight: '300' as const },
  lead: {
    color: c.fgMuted,
    fontSize: fontSize.small,
    lineHeight: 22,
    marginTop: spacing.sm,
    maxWidth: 340,
  },
  filters: { marginTop: spacing.md, flexDirection: 'row' as const },
  grid: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  card: {
    flex: 1,
    aspectRatio: 4 / 5,
    borderRadius: radius.md,
    overflow: 'hidden' as const,
    backgroundColor: c.inkSoft,
    borderWidth: 1,
    borderColor: c.line,
  },
  cardImg: { width: '100%' as const, height: '100%' as const, position: 'absolute' as const },
  cardGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%' as const,
  },
  cardOverlay: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
  },
  cardCity: {
    color: '#E8C547',
    fontSize: 10,
    letterSpacing: 2.5,
    textTransform: 'uppercase' as const,
    fontWeight: '600' as const,
  },
  cardTitle: {
    color: '#F4ECD8',
    fontFamily: 'serif',
    fontSize: 15,
    marginTop: 2,
    lineHeight: 19,
    fontWeight: '400' as const,
  },
});
