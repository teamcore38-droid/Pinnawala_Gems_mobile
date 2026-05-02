import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { design } from '@/constants/design';

const sections = [
  {
    title: 'File-based routing',
    text: 'Expo Router keeps screens organized and easy to navigate.',
    icon: 'layers-outline',
  },
  {
    title: 'Responsive commerce flow',
    text: 'The app adapts between catalog browsing, cart, checkout, and order tracking.',
    icon: 'phone-portrait-outline',
  },
  {
    title: 'Admin operations',
    text: 'Product and order management use the same premium visual language.',
    icon: 'briefcase-outline',
  },
] as const;

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Explore</Text>
        <Text style={styles.title}>A quick look at the app structure</Text>
        <Text style={styles.subtitle}>
          This screen highlights how the app is organized and how the customer and admin
          experiences fit together.
        </Text>
      </View>

      <View style={styles.sectionList}>
        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <View style={styles.cardIcon}>
              <Ionicons name={section.icon} size={20} color={design.colors.accentDark} />
            </View>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardText}>{section.text}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: design.colors.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  hero: {
    padding: 22,
    borderRadius: 28,
    backgroundColor: design.colors.accentDark,
    marginBottom: 16,
  },
  kicker: {
    color: '#F6D7B2',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
  },
  title: {
    color: '#FFF8F1',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  sectionList: {
    gap: 12,
  },
  card: {
    backgroundColor: design.colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: design.colors.border,
    padding: 18,
    shadowColor: '#1F2937',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: design.colors.accentSoft,
    marginBottom: 12,
  },
  cardTitle: {
    color: design.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  cardText: {
    marginTop: 6,
    color: design.colors.muted,
    lineHeight: 20,
  },
});
