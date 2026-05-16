import { Text, View } from 'react-native';
import { categoryColor } from '@/constants/theme';

/**
 * Badge "cat-tag" — pastille colorée à overlay sur project-card.
 * Reprend le style du design system web (palette mosaïque du logo).
 *
 * Usage :
 *   <CategoryBadge slug={project.category?.slug} label={project.category?.name} />
 */
export function CategoryBadge({ slug, label, variant = 'tag' }: {
  slug?: string | null;
  label?: string;
  variant?: 'tag' | 'badge';
}) {
  if (!label) return null;
  const color = categoryColor(slug);

  if (variant === 'badge') {
    // Variante "badge" — bord coloré, fond transparent, pour listes
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 999,
          borderWidth: 1,
          borderColor: color,
          backgroundColor: color + '1f', // 12% alpha
          alignSelf: 'flex-start',
        }}
      >
        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
        <Text
          style={{
            color,
            fontSize: 10,
            letterSpacing: 1.6,
            textTransform: 'uppercase',
            fontWeight: '700',
          }}
        >
          {label}
        </Text>
      </View>
    );
  }

  // Variante "tag" — overlay foncé + pastille glow, pour photos
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 999,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
      }}
    >
      <View
        style={{
          width: 5,
          height: 5,
          borderRadius: 2.5,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 1,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 0 },
        }}
      />
      <Text
        style={{
          color,
          fontSize: 9,
          letterSpacing: 1.8,
          textTransform: 'uppercase',
          fontWeight: '700',
        }}
      >
        {label}
      </Text>
    </View>
  );
}
