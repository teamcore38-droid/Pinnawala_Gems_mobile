import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { design } from '@/constants/design';

const highlights = [
  {
    icon: 'sparkles-outline',
    title: 'Curated collection',
    text: 'Showcase products with a clean luxury-first layout.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Trusted checkout',
    text: 'Move through cart and payment with clear visual structure.',
  },
  {
    icon: 'stats-chart-outline',
    title: 'Admin clarity',
    text: 'Track products and orders from a polished control center.',
  },
] as const;

export default function HomeScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Pinnawala Jewelry</Text>
        <Text style={styles.title}>A refined storefront experience for mobile shopping</Text>
        <Text style={styles.subtitle}>
          Explore products, manage orders, and move between customer and admin flows with a design
          that feels deliberate and premium.
        </Text>

        <View style={styles.buttonRow}>
          <Link href="/role-select" asChild>
            <Pressable style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Get started</Text>
            </Pressable>
          </Link>
          <Link href="/user-dashboard" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Shop now</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why it feels polished</Text>
        <View style={styles.highlightGrid}>
          {highlights.map((item) => (
            <View key={item.title} style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons name={item.icon} size={20} color={design.colors.accentDark} />
              </View>
              <Text style={styles.highlightTitle}>{item.title}</Text>
              <Text style={styles.highlightText}>{item.text}</Text>
            </View>
          ))}
        </View>
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
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: 'rgba(255, 248, 241, 0.84)',
    marginTop: 12,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: design.colors.accent,
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '800',
  },
  section: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: design.colors.text,
    marginBottom: 12,
  },
  highlightGrid: {
    gap: 12,
  },
  highlightCard: {
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
  highlightIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: design.colors.accentSoft,
    marginBottom: 12,
  },
  highlightTitle: {
    color: design.colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  highlightText: {
    marginTop: 6,
    color: design.colors.muted,
    lineHeight: 20,
  },
});
