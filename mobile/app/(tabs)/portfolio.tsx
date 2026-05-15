import { useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { fetchProjects, fetchCategories, fetchProjectCities } from '@/src/api/endpoints';
import { colors, spacing, fontSize, radius } from '@/constants/theme';

export default function PortfolioScreen() {
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
        <Text style={styles.title}>Nos réalisations</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
          <Pill label="Toutes" active={category === 'all'} onPress={() => setCategory('all')} />
          {(categories ?? []).map((c) => (
            <Pill key={c.id} label={c.name} active={category === c.slug} onPress={() => setCategory(c.slug)} />
          ))}
        </ScrollView>

        {(cities?.length ?? 0) > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.filters, { marginTop: 6 }]}>
            <Pill label="Toutes villes" active={city === 'all'} onPress={() => setCity('all')} />
            {(cities ?? []).map((c) => (
              <Pill key={c} label={c} active={city === c} onPress={() => setCity(c)} />
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
          <Text style={{ color: colors.fgMuted, textAlign: 'center', marginTop: spacing.xl }}>
            {isLoading ? 'Chargement…' : 'Aucune réalisation pour ces filtres.'}
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(`/project/${item.slug}`)}>
            {item.cover_image && <Image source={{ uri: item.cover_image }} style={styles.cardImg} />}
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

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.pill,
        active && { borderColor: colors.gold, backgroundColor: 'rgba(212,175,55,0.12)' },
      ]}
    >
      <Text style={[styles.pillText, active && { color: colors.gold }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { paddingTop: 60, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  eyebrow: { color: colors.gold, fontSize: fontSize.caption, letterSpacing: 3, textTransform: 'uppercase' },
  title: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.hero, fontWeight: '300', marginTop: spacing.xs, lineHeight: 44 },
  filters: { marginTop: spacing.md, flexDirection: 'row' },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.line, marginRight: spacing.xs },
  pillText: { color: colors.fgMuted, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  grid: { padding: spacing.md, gap: spacing.sm, paddingBottom: spacing.xxl },
  card: { flex: 1, aspectRatio: 4 / 5, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.ink, borderWidth: 1, borderColor: colors.line },
  cardImg: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: spacing.sm, backgroundColor: 'rgba(7,6,10,0.85)' },
  cardCity: { color: colors.gold, fontSize: 9, letterSpacing: 2.5, textTransform: 'uppercase' },
  cardTitle: { color: colors.fg, fontFamily: 'serif', fontSize: fontSize.body, marginTop: 2, lineHeight: 18 },
});
